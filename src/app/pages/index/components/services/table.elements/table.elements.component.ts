import { Component, ViewChild } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../../interfaces/paginable';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { PublishFormComponent } from '../publish.form/publish.form.component';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertModalComponent } from '../../../../../components/alert.modal/alert.modal.component';
import { AlertService } from '../../../../../core/services/alert.service';
import { RouterModule } from '@angular/router';
import { ServiceSuscribeService } from '../../../../../core/services/service.suscribe.service';

@Component({
  selector: 'app-table-elements',
  standalone: true, 
  imports: [AsyncPipe, CommonModule, RouterModule, AlertModalComponent, ComboSelectorComponent, DialogFormComponent, PublishFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableServicesComponent {
  
  @ViewChild('publish_dialog') publishDialog!: DialogFormComponent;
  @ViewChild(PublishFormComponent) publishForm!: PublishFormComponent;

  public services!: Observable<Paginable<ServiceLite>>;

  constructor(private alert: AlertService, private service: RustDbManagerService, private serviceSuscribe: ServiceSuscribeService) {
  }

  ngOnInit(): void {
    this.services = this.service.services();
  }

  refreshServices() {
    this.services = this.service.services();
  }

  openPublishModal() {
    this.publishDialog.openModal();
  }

  closePublishModal() {
    this.publishDialog.closeModal();
  }

  onPublish() {
    this.publishForm.onSubmit();
  }

  remove(code: string) {
    this.service.remove(code).subscribe({
      error: (e: ResponseException) => {
        let status = e.status;
        if(status == 404) {
          this.alert.alert(`Service ${code} not found.`);
          return;
        }

        if(status && status > 399 && status < 500) {
          this.serviceSuscribe.suscribe({
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

}