import { Component, ViewChild } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/response/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../../interfaces/response/paginable';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { PublishFormComponent } from '../publish.form/publish.form.component';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertModalComponent } from '../../../../../components/alert.modal/alert.modal.component';
import { AlertService } from '../../../../../core/services/alert.service';
import { Router, RouterModule } from '@angular/router';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';

@Component({
  selector: 'app-table-elements',
  standalone: true, 
  imports: [AsyncPipe, CommonModule, RouterModule, AlertModalComponent, ComboSelectorComponent, DialogFormComponent, PublishFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableServicesComponent {
  
  @ViewChild('form_dialog') formDialog!: DialogFormComponent;
  @ViewChild(PublishFormComponent) formComponent!: PublishFormComponent;

  public services!: Observable<Paginable<ServiceLite>>;
  public status: {[key:string]: string} = {}

  constructor(private router: Router, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.services = this.resolver.services();
    this.verifyAllStatus();
  }

  openModal() {
    this.formDialog.openModal();
  }

  closeModal() {
    this.formDialog.closeModal();
  }

  onSubmit() {
    this.formComponent.onSubmit();
  }

  verifyAllStatus() {
    this.services.forEach(n => n.services.forEach(v => this.verifyStatus(v.name)))
  }

  verifyStatus(service: string) {
    this.status[service] = "connecting";
    this.resolver.serviceStatus(service).subscribe({
      next: (status: string) => this.status[service] = status,
      error: () => this.status[service] = "error",
    });
  }

  remove(service: string) {
    this.resolver.remove(service).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          service: service,
          suscribeCallback: {
            func: this.remove.bind(this),
            args: [service]
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

  loadService(service: string) {
    this.router.navigate(["/service", service])
  }

}