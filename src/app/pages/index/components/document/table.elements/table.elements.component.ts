import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DocumentDataParser } from '../../../../../interfaces/server/document/document.data.parsed';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { WorkshopFormRequest } from '../../../../../interfaces/worksop.form.request';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { Optional } from '../../../../../types/optional';
import { Dict } from '../../../../../types/dict';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @Input() refreshBranch: Function;

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public documents: Optional<DocumentDataParser[]>;
  public details: boolean[];

  constructor(private route: ActivatedRoute, private sanitized: DomSanitizer, public utils: UtilsService, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
    this.details = [];
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";

    this.refreshData();
  }

  keyValue(document: DocumentDataParser) {
    if(document.base_key) {
      return document.base_key?.value;
    }
    return document.keys.map(k => k.value).join(" - ");
  }

  fieldValue(field: string, document: DocumentDataParser) {
    const stringify = JSON.stringify(document.document[field], null, 2);
    const beautify = this.utils.beautifyDocument(stringify);
    return this.sanitized.bypassSecurityTrustHtml(beautify);
  }

  documentKeys(document: DocumentDataParser) {
    return Object.keys(document.document).sort();
  }

  refreshData() {
    this.resolver.documentFindAll(this.service, this.dataBase, this.collection).pipe(
      map(documents => {
        this.details = Array.apply(null, Array(documents.length)).map(() => false)
        this.documents = documents.map(document => {
          let parsed: Dict<any>;
          try {
            parsed = JSON.parse(document.document)
          } catch (error) {
            parsed = {};
          }

          const documentParsed: DocumentDataParser = {
            data_base: document.data_base,
            collection: document.collection,
            base_key: document.base_key,
            keys: document.keys,
            document: parsed
          }
          return documentParsed;
        });
      })
    ).subscribe();
  }

  switchExpand() {
    const direction = this.details.filter(d => d).length < this.details.length / 2;console.log(direction)
    this.details = this.details.map(d => direction);
  }

  switchDetails(index: number) {
    this.details[index] = !this.details[index];
  }

  openForm() {
    this.redirect.goToNewWorkshop(this.service, this.dataBase, this.collection);
  }

  remove(document: DocumentDataParser) {
    let keys = document.keys;
    let title = document.keys.map(k => k.value).join("#");
    if(document.base_key != undefined) {
      keys = [document.base_key];
      title = document.base_key.value
    }

    this.resolver.documentDelete(this.service, this.dataBase, this.collection, keys).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Document",
          name: title,
          service: this.service,
          nextCallback: {
            func: this.remove.bind(this),
            args: [document]
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => {
        this.alert.message(`Document '${title}' removed successfully.`);
        this.refreshData();
      }
    });
  }

  loadDocument(document: DocumentDataParser) {
    const request: WorkshopFormRequest = {
      base_key: document.base_key,
      keys: document.keys
    };
    this.redirect.goToWorkshop(this.service, this.dataBase, this.collection, request);
  }

}