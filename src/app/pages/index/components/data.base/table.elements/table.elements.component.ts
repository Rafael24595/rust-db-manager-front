import { Component, Input, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { CreateFormComponent } from '../create.form/create.form.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RedirectService } from '../../../../../core/services/redirect.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [CommonModule, RouterModule, ComboSelectorComponent, CreateFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @ViewChild(CreateFormComponent) 
  protected formComponent!: CreateFormComponent;
  
  @Input() 
  public refreshBranch: Function;
  
  protected service!: string;
  protected dataBases!: string[];

  public constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
  }

  protected ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";

    this.refreshData();
  }

  public refreshData() {
    this.resolver.dataBaseFindAll(this.service).subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (dataBases) => {
        this.dataBases = dataBases;
      }
    });
  }

  protected openForm() {
    this.formComponent.openModal();
  }

  protected remove(dataBase: string) {
    this.resolver.dataBaseRemove(this.service, dataBase).subscribe({
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

  protected load(dataBase: string) {
    this.redirect.goToDataBase(this.service, dataBase);
  }

}