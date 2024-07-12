import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { CommonModule } from '@angular/common';
import { CreateFormComponent } from '../create.form/create.form.component';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { ComboActionsComponent } from './combo.actions/combo.actions/combo.actions.component';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [CommonModule, ComboSelectorComponent, CreateFormComponent, ComboActionsComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @Input() 
  public refreshBranch: Function;

  protected service!: string;
  protected dataBase!: string;

  protected collections!: string[];
  protected cursor: string;

  public constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private resolver: RustDbManagerService) {
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
    this.resolver.collectionFindAll(this.service, this.dataBase).subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (collections) => {
        this.collections = collections;
      }
    });
  }

  protected openForm(): void {
    this.redirect.goToCollectionForm(this.service, this.dataBase);
  }

  protected load(collection: string) {
    this.redirect.goToCollection(this.service, this.dataBase, collection);
  }

}