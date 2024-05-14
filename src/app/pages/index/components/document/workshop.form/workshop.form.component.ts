import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { DocumentKeysParserService } from '../../../../../core/services/utils/document.keys.parser.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { DocumentData } from '../../../../../interfaces/server/document/document.data';
import { AsyncPipe } from '@angular/common';
import { DbLogoService } from '../../../../../core/services/view/db.logo.service';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { UpdateDocument } from '../../../../../interfaces/update.document';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { DocumentSchema } from '../../../../../interfaces/server/document/document.schema';
import { Optional } from '../../../../../types/optional';
import { Dict } from '../../../../../types/dict';
import { WorkshopFormRequest } from '../../../../../interfaces/worksop.form.request';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule, CodemirrorModule],
  templateUrl: './workshop.form.component.html',
  styleUrl: './workshop.form.component.css'
})
export class WorkshopFormComponent {

  @ViewChild('text_area') text_area!: ElementRef;

  public documentData: Optional<DocumentData>;
  public documentOriginal!: string;
  public documentUpdated!: string;

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public keys!: DocumentKey[];

  public options = {
    mode: "application/ld+json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private logo: DbLogoService, private keyParser: DocumentKeysParserService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";
    this.keys = this.keyParser.deserialize(snapshot);

    if(this.keys && this.keys.length > 0) {
      this.refreshData();
      return;
    }

    this.newData();
  }

  refreshData() {
     this.resolver.documentFind(this.service, this.dataBase, this.collection, this.keys).subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            key: "Document",
            name: this.documentTitle(),
            service: this.service,
            exitCallback: {
              func: () => this.redirect.goToCollection(this.service, this.dataBase, this.collection)
            }
          })) {
            return;
          }

          console.error(e);
          this.alert.alert(e.message);
        },
        next: (documentData: DocumentData) => {
          this.documentData = documentData;
          try {
            this.documentOriginal = JSON.stringify(JSON.parse(documentData.document), null, 2);
            this.documentUpdated = this.documentOriginal;
          } catch (error) {
            this.documentOriginal = documentData.document;
          }
    
          const title = `Editing document: ${this.documentTitle()}`;
          this.logo.set(title, this.service);
        },
      }
    );
  }

  newData() {
    this.resolver.documentShema(this.service, this.dataBase, this.collection).subscribe({
       error: (e: ResponseException) => {
         if(this.handler.autentication(e, {
           key: "Document",
           name: this.documentTitle(),
           service: this.service,
           exitCallback: {
             func: () => this.redirect.goToCollection(this.service, this.dataBase, this.collection)
           }
         })) {
           return;
         }

         console.error(e);
         this.alert.alert(e.message);
       },
       next: (documentSchema: DocumentSchema) => {
        const document: Dict<string> = {};
        for (const field of documentSchema.fields) {
          document[field.code] = field.value;
        }

        try {
          this.documentOriginal = JSON.stringify(document, null, 2);
          this.documentUpdated = this.documentOriginal;
        } catch (error) {
          this.documentOriginal = "{}";
        }

        documentSchema.comments.forEach(c => this.alert.message(c));
   
        const title = `New document: ${this.documentTitle()}`;
        this.logo.set(title, this.service);
       },
     }
   );
 }

  handleChange($event: string): void {
    console.log(this.documentUpdated);
    this.documentUpdated = $event;
  }

  documentTitle() {
    if(!this.documentData) {
      return "";
    }

    if(this.documentData.base_key) {
      return this.documentData.base_key.value
    }

    return this.documentData.keys.map(k => k.value).join("#");
  }

  create() {
    const document: UpdateDocument = {
      document: this.documentUpdated,
      keys: this.keys
    };

    this.resolver.documentInsert(this.service, this.dataBase, this.collection, document).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Document",
          name: this.documentTitle(),
          service: this.service,
          nextCallback: {
            func: this.update.bind(this)
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      next: (documentData) => {
        this.alert.message(`Document created successfully.`);

        const request: WorkshopFormRequest = {
          base_key: documentData.base_key,
          keys: documentData.keys
        }
        
        this.redirect.goToWorkshop(this.service, this.dataBase, this.collection, request);
      }
    });
  }

  update() {
    const document: UpdateDocument = {
      document: this.documentUpdated,
      keys: this.keys
    };

    this.resolver.documentUpdate(this.service, this.dataBase, this.collection, document).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Document",
          name: this.documentTitle(),
          service: this.service,
          nextCallback: {
            func: this.update.bind(this)
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => {
        this.alert.message(`Document '${this.documentTitle()}' updated successfully.`);
        this.refreshData()
      }
    });
  }

  remove() {
    this.resolver.documentDelete(this.service, this.dataBase, this.collection, this.keys).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Document",
          name: this.documentTitle(),
          service: this.service,
          nextCallback: {
            func: this.remove.bind(this)
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => {
        this.alert.message(`Document '${this.documentTitle()}' removed successfully.`);
        this.redirect.goToCollection(this.service, this.dataBase, this.collection);
      }
    });
  }

}