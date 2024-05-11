import { Component, Input } from '@angular/core';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { CreateFormComponent } from '../create.form/create.form.component';
import { RedirectService } from '../../../../../core/services/redirect.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, DialogFormComponent, CreateFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @Input() refreshBranch: Function;

  public service!: string;
  public dataBase!: string;

  public collections!: Observable<string[]>;

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private utils: UtilsService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";

    this.refreshData();
  }

  refreshData() {
    this.collections = this.resolver.collectionFindAllLite(this.service, this.dataBase);
  }

  openForm() {
    this.redirect.goToCollectionForm(this.service, this.dataBase);
  }

  remove(collection: string) {
    this.resolver.collectionDrop(this.service, this.dataBase, collection).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          service: this.service,
          nextCallback: {
            func: this.remove.bind(this),
            args: [collection]
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => this.refreshData()
    });
  }

  exportJson(collection: string) {
    this.resolver.collectionFindAll(this.service, this.dataBase, collection)
      .pipe(
        map(json => {
          const filename = `${this.service}-${this.dataBase}-${collection}_${Date.now()}.json`;
          this.utils.downloadFile(filename, json.join("\n"));
        })
      )
      .subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            service: this.service,
            nextCallback: {
              func: this.exportJson.bind(this)
            }
          })) {
            return;
          }

          console.error(e);
          this.alert.alert(e.message);
        },
        complete: () => this.refreshBranch()
      });
  }

  loadCollection(collection: string) {
    this.redirect.goToCollection(this.service, this.dataBase, collection);
  }

}