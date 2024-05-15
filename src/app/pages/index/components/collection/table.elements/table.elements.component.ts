import { Component, Input, ViewChild } from '@angular/core';
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
import { RenameFormComponent } from '../rename.form/rename.form.component';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, CreateFormComponent, RenameFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @ViewChild(RenameFormComponent) 
  private renameFormComponent!: RenameFormComponent;

  @Input() 
  public refreshBranch: Function;

  protected service!: string;
  protected dataBase!: string;

  protected collections!: Observable<string[]>;
  protected cursor: string;

  public constructor(private route: ActivatedRoute, private redirect: RedirectService, private utils: UtilsService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
    this.cursor = "";
  }

  public ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";

    this.refreshData();
  }

  public refreshData(): void {
    this.collections = this.resolver.collectionFindAll(this.service, this.dataBase);
  }

  protected openForm(): void {
    this.redirect.goToCollectionForm(this.service, this.dataBase);
  }

  protected rename(collection: string): void {
    this.cursor = collection;
    this.renameFormComponent.openModal();
  }

  protected remove(collection: string): void {
    this.resolver.collectionRemove(this.service, this.dataBase, collection).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Collection",
          name: collection,
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

  protected exportJson(collection: string): void {
    this.resolver.collectionExport(this.service, this.dataBase, collection)
      .pipe(
        map(json => {
          const filename = `${this.service}-${this.dataBase}-${collection}_${Date.now()}.json`;
          this.utils.downloadFile(filename, json.join("\n"));
        })
      )
      .subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            key: "Collection",
            name: collection,
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

  protected load(collection: string) {
    this.redirect.goToCollection(this.service, this.dataBase, collection);
  }

}