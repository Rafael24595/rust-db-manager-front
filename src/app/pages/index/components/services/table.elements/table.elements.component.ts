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
import { ServiceSuscribeService } from '../../../../../core/services/service.suscribe.service';

@Component({
  selector: 'app-table-elements',
  standalone: true, 
  imports: [AsyncPipe, CommonModule, RouterModule, AlertModalComponent, ComboSelectorComponent, DialogFormComponent, PublishFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableServicesComponent {
  
  @ViewChild('form_dialog') formDialog!: DialogFormComponent;
  @ViewChild(PublishFormComponent) publishForm!: PublishFormComponent;

  public services!: Observable<Paginable<ServiceLite>>;
  public status: {[key:string]: string} = {}

  constructor(private router: Router, private alert: AlertService, private resolver: RustDbManagerService, private suscribe: ServiceSuscribeService) {
  }

  ngOnInit(): void {
    this.refreshServices();
  }

  refreshServices() {
    this.services = this.resolver.services();
    this.verifyAllStatus();
  }

  openModal() {
    this.formDialog.openModal();
  }

  closeModal() {
    this.formDialog.closeModal();
  }

  onPublish() {
    this.publishForm.onSubmit();
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

  remove(code: string) {
    this.resolver.remove(code).subscribe({
      error: (e: ResponseException) => {
        let status = e.status;
        if(status == 404) {
          this.alert.alert(`Service ${code} not found.`);
          return;
        }

        if(status && status > 399 && status < 500) {
          this.suscribe.suscribe({
            service: code,
            suscribeCallback: {
              func: this.remove.bind(this),
              args: code
            }
          });
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => this.refreshServices()
    });
  }

  loadService(service: string) {
    this.router.navigate(["/service", service])
  }

}