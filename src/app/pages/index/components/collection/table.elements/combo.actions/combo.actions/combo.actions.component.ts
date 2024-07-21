import { Component, Input, ViewChild } from '@angular/core';
import { ModalButton } from '../../../../../../../interfaces/modal.button';
import { RustDbManagerService } from '../../../../../../../core/services/rust.db.manager.service';
import { ResponseHandlerService } from '../../../../../../../core/services/response.handler.service';
import { AlertService } from '../../../../../../../core/services/view/alert.service';
import { UtilsService } from '../../../../../../../core/services/utils/utils.service';
import { RedirectService } from '../../../../../../../core/services/redirect.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, Observable, of } from 'rxjs';
import { ActionDefinition } from '../../../../../../../interfaces/server/action/definition/action.definition';
import { RenameFormComponent } from '../../../rename.form/rename.form.component';
import { ImportFormComponent } from '../../../import.form/import.form.component';
import { AsyncPipe } from '@angular/common';
import { ComboSelectorComponent } from "../../../../../../../components/combo.selector/combo.selector.component";
import { ResponseException } from '../../../../../../../core/commons/response.exception';
import { Action } from '../../../../../../../interfaces/server/action/generate/action';
import { ActionService } from '../../../../../../../core/services/view/action.service';

@Component({
    selector: 'app-combo-actions',
    standalone: true,
    templateUrl: './combo.actions.component.html',
    styleUrl: './combo.actions.component.css',
    imports: [AsyncPipe, RenameFormComponent, ImportFormComponent, ComboSelectorComponent]
})
export class ComboActionsComponent {

  @ViewChild(RenameFormComponent) 
  private renameForm!: RenameFormComponent;
  @ViewChild(ImportFormComponent) 
  private importForm!: ImportFormComponent;

  @Input() 
  public refreshBranch: Function;

  @Input() 
  public collection!: string;

  protected readonly defaultActions: ModalButton[] = [
      {
          title: 'View', 
          callback: {func: this.load.bind(this), args: [this.collection]}, 
          icon: {icon: '⤇'}
      },
      {
          title: 'Rename', 
          callback: {func: this.rename.bind(this), args: [this.collection]}, 
          icon: {icon: '···'}
      },
      {
          title: 'Remove', 
          callback: {func: this.remove.bind(this), args: [this.collection]}, 
          icon: {icon: '🗑'}
      },
      {
          title: 'Export JSON', 
          callback: {func: this.exportJson.bind(this), args: [this.collection]}, 
          icon: {icon: '🖫'}
      },
      {
          title: 'Import JSON', 
          callback: {func: this.importJson.bind(this), args: [this.collection]}, 
          icon: {icon: '🖬'}
      },
    ];

    protected service!: string;
    protected dataBase!: string;

    protected actions!: Observable<ModalButton[]>;

    public constructor(private route: ActivatedRoute, private redirect: RedirectService, private utils: UtilsService, private alert: AlertService, private handler: ResponseHandlerService, private actionService: ActionService, private resolver: RustDbManagerService) {
      this.refreshBranch = () => {};
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
      const actions = this.resolver.collectionActionsList(this.service, this.dataBase, this.collection).pipe(
        map(definitions => definitions.map(d => this.makeAction(d)))
      );
      this.actions = forkJoin([of(this.defaultActions), actions])
      .pipe(
        map(([ defaults, server ]) => [...defaults, ...server ])
      )
    }

    private makeAction(action: ActionDefinition): ModalButton {
      return {
        title: action.title,
        callback: {
          func: this.openActionForm.bind(this),
          args: [this.collection, action]
        },
        icon: {
          icon: "★"
        }
      }
    }
  
    protected openForm(): void {
      this.redirect.goToCollectionForm(this.service, this.dataBase);
    }
  
    protected rename(): void {
      this.renameForm.openModal();
    }
  
    protected remove(): void {
      this.resolver.collectionRemove(this.service, this.dataBase, this.collection).subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            key: "Collection",
            name: this.collection,
            service: this.service,
            nextCallback: {
              func: this.remove.bind(this),
              args: [this.collection]
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
            const vector = `[\n${json.map(d => d.document).join(",\n")}\n]`;
            this.utils.downloadFile(filename, vector);
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
          }
        });
    }
  
    protected importJson(): void {
      this.importForm.openModal();
    }
    
    protected openActionForm(collection: string, action: ActionDefinition) {
      this.redirect.goToActionForm(action.action, this.service, this.dataBase, collection);
    }

    protected executeAction(collection: string, action: Action) {
      this.resolver.collectionActionExecute(this.service, this.dataBase, collection, action).subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            key: "Collection",
            name: collection,
            service: this.service,
            nextCallback: {
              func: this.executeAction.bind(this),
              args: [collection, action]
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

    protected load(collection: string) {
      this.redirect.goToCollection(this.service, this.dataBase, collection);
    }

}