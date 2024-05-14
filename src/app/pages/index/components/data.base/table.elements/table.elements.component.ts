import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { CreateFormComponent } from '../create.form/create.form.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RedirectService } from '../../../../../core/services/redirect.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterModule, ComboSelectorComponent, DialogFormComponent, CreateFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @Input() refreshBranch: Function;
  
  @ViewChild('form_dialog') formDialog!: DialogFormComponent;
  @ViewChild(CreateFormComponent) formComponent!: CreateFormComponent;

  public service!: string;

  public dataBases!: Observable<string[]>;

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
  }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";

    this.refreshData();
  }

  refreshData() {
    this.dataBases = this.resolver.dataBaseFindAll(this.service);
  }

  openModal() {
    this.formDialog.openModal();
  }

  closeModal() {
    this.formDialog.closeModal();
  }

  onSubmit() {
    this.formComponent.onSubmit();
    this.refreshBranch();
  }

  remove(dataBase: string) {
    this.resolver.dataBaseDrop(this.service, dataBase).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Data base",
          name: dataBase,
          service: this.service,
          nextCallback: {
            func: this.remove.bind(this),
            args: [dataBase]
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

  loadDataBase(dataBase: string) {
    this.redirect.goToDataBase(this.service, dataBase);
  }

}