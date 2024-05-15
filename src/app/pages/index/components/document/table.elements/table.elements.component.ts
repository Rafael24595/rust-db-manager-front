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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @Input() 
  public refreshBranch: Function;

  protected service!: string;
  protected dataBase!: string;
  protected collection!: string;

  protected documents: Optional<DocumentDataParser[]>;
  protected details: boolean[];

  public constructor(private route: ActivatedRoute, private sanitized: DomSanitizer, public utils: UtilsService, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
    this.details = [];
  }

  protected ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";

    this.refreshData();
  }

  protected keyValue(document: DocumentDataParser): string {
    if(document.base_key) {
      return document.base_key?.value;
    }
    return document.keys.map(k => k.value).join(" - ");
  }

  protected fieldValue(field: string, document: DocumentDataParser): SafeHtml {
    const stringify = JSON.stringify(document.document[field], null, 2);
    const beautify = this.utils.beautifyDocument(stringify);
    return this.sanitized.bypassSecurityTrustHtml(beautify);
  }

  protected documentKeys(document: DocumentDataParser): string[] {
    return Object.keys(document.document).sort();
  }

  public refreshData(): void  {
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

  protected switchExpand(): void  {
    const direction = this.details.filter(d => d).length < this.details.length / 2;console.log(direction)
    this.details = this.details.map(d => direction);
  }

  protected switchDetails(index: number): void  {
    this.details[index] = !this.details[index];
  }

  public openForm(): void  {
    this.redirect.goToNewWorkshop(this.service, this.dataBase, this.collection);
  }

  protected removeAll(): void  {
    const keys: DocumentKey[] = [];
    const title = "All";
    this._remove(keys, title);
  }

  protected remove(document: DocumentDataParser): void  {
    let keys = document.keys;
    let title = document.keys.map(k => k.value).join("#");
    if(document.base_key != undefined) {
      keys = [document.base_key];
      title = document.base_key.value
    }
    this._remove(keys, title);
  }

  private _remove(keys: DocumentKey[], title: string): void  {
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

  protected load(document: DocumentDataParser): void {
    const request: WorkshopFormRequest = {
      base_key: document.base_key,
      keys: document.keys
    };
    this.redirect.goToWorkshop(this.service, this.dataBase, this.collection, request);
  }

}