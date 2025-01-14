import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { DocumentKeysParserService } from '../../../../../core/services/utils/document.keys.parser.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { DocumentData } from '../../../../../interfaces/server/document/document.data';
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
import { DocumentDataParser } from '../../../../../interfaces/server/document/document.data.parsed';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [FormsModule, CodemirrorModule],
  templateUrl: './workshop.form.component.html',
  styleUrl: './workshop.form.component.css'
})
export class WorkshopFormComponent {

  @ViewChild('text_area') text_area!: ElementRef;

  protected schema!: DocumentSchema;

  public document: Optional<DocumentDataParser>;
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
     this.refreshSchema();
  }

  public refreshSchema(): void  {  
    this.resolver.collectionShema(this.service, this.dataBase, this.collection).subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (schema) => {
          this.schema = schema;
          this.refreshDocument();
      },
    });
  }

  refreshDocument() {
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
         this.refreshDataByDocument(documentData);
       },
     }
   );
 }

  refreshDataByDocument(document: DocumentData) {
    this.document = this.parseDocument(document);
    this.keys = this.keyParser.keysFromDocument(this.schema, this.document);
    try {
      this.documentOriginal = JSON.stringify(JSON.parse(document.document), null, 2);
      this.documentUpdated = this.documentOriginal;
    } catch (error) {
      this.documentOriginal = document.document;
    }

    const title = `Editing document: ${this.documentTitle()}`;
    this.logo.set(title, this.service);
 }

  private parseDocument(document: DocumentData): DocumentDataParser {
    let parsed: Dict<any>;
    try {
      parsed = JSON.parse(document.document)
    } catch (error) {
      parsed = {};
    }
    
    const documentParsed: DocumentDataParser = {
      data_base: document.data_base,
      collection: document.collection,
      size: document.size,
      document: parsed
    }
    return documentParsed;
  }

  newData() {
    this.resolver.collectionShema(this.service, this.dataBase, this.collection).subscribe({
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
    this.documentUpdated = $event;
  }

  documentTitle() {
    if(!this.document) {
      return "";
    }

    return this.keyParser
      .keysFromDocument(this.schema, this.document)
      .map(k => k.value)
      .join("#");
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
        this.refreshDataByDocument(documentData);
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