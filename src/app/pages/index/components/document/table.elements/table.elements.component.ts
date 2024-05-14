import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DocumentDataParser } from '../../../../../interfaces/server/document/document.data.parsed';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { WorkshopFormRequest } from '../../../../../interfaces/worksop.form.request';
import { ResponseException } from '../../../../../core/commons/response.exception';

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

  public documents!: Observable<DocumentDataParser[]>;

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
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

  refreshData() {
    this.documents = this.resolver.documentFindAll(this.service, this.dataBase, this.collection).pipe(
      map(documents => {
        try {
          return documents.map(document => {
            const documentParsed: DocumentDataParser = {
              data_base: document.data_base,
              collection: document.collection,
              base_key: document.base_key,
              keys: document.keys,
              document: JSON.parse(document.document)
            }
            return documentParsed;
          });
        } catch (error) {
          this.alert.alert(`${error}`);
          return [];
        }
      })
    );
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