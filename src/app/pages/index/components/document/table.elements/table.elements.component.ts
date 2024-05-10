import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DocumentDataParser } from '../../../../../interfaces/server/document/document.data.parsed';

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

  //public documents!: Observable<{[key:string]:any}[]>;
  public documents!: Observable<DocumentDataParser[]>;

  constructor(private router: Router, private route: ActivatedRoute, private utils: UtilsService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
  }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = this.route.snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = this.route.snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";
    this.refreshData();
  }

  refreshData() {
    this.documents = this.resolver.collectionFindAll(this.service, this.dataBase, this.collection).pipe(
      map(documents => {
        try {
          return documents.map(document => {
            console.log(JSON.parse(document.document));
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
  }

  loadDocument(document: string) {
    this.router.navigate(["/service", this.service, "data-base", this.dataBase, "collection", this.collection, "document", document]);
  }

}