import { Component, Input, ViewChild } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/server/service/definition/service.lite';
import { Observable } from 'rxjs';
import { PaginatedCollection } from '../../../../../interfaces/server/pagination/paginated.collection';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PublishFormComponent } from '../publish.form/publish.form.component';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertModalComponent } from '../../../../../components/alert.modal/alert.modal.component';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { RouterModule } from '@angular/router';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { Dict } from '../../../../../types/dict';

@Component({
  selector: 'app-table-elements',
  standalone: true, 
  imports: [AsyncPipe, CommonModule, RouterModule, AlertModalComponent, ComboSelectorComponent, PublishFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {
  
  @Input() 
  public refreshBranch: Function;

  @ViewChild(PublishFormComponent)
  private formComponent!: PublishFormComponent;

  protected services!: Observable<PaginatedCollection<ServiceLite>>;
  protected status: Dict<string>;

  public constructor(private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
    this.status = {};
  }

  protected ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(): void {
    this.services = this.resolver.serviceFindAll();
    this.verifyAllStatus();
  }

  private verifyAllStatus(): void {
    this.services.forEach(n => n.services.forEach(v => this.verifyStatus(v.name)))
  }

  protected verifyStatus(service: string): void {
    this.status[service] = "connecting";
    this.resolver.serviceStatus(service).subscribe({
      next: (status: string) => this.status[service] = status,
      error: () => this.status[service] = "error",
    });
  }

  protected openForm(): void {
    this.formComponent.openModal();
  }

  protected remove(service: string): void {
    this.resolver.serviceRemove(service).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Service",
          name: service,
          service: service,
          nextCallback: {
            func: this.remove.bind(this),
            args: [service]
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

  protected load(service: string): void {
    this.redirect.goToService(service);
  }

}