import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { CreateFormComponent } from '../create.form/create.form.component';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { ComboActionsComponent } from './combo.actions/combo.actions/combo.actions.component';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, CreateFormComponent, ComboActionsComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

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

  protected load(collection: string) {
    this.redirect.goToCollection(this.service, this.dataBase, collection);
  }

}