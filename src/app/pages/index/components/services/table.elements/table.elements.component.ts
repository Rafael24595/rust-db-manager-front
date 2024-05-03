import { Component, ViewChild } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../../interfaces/paginable';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { PublishFormComponent } from '../publish.form/publish.form.component';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { SuscribeFormComponent } from '../suscribe.form/suscribe.form.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { Callback } from '../../../../../interfaces/callback';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, DialogFormComponent, PublishFormComponent, SuscribeFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableServicesComponent {
  
  @ViewChild('publish_dialog') publishDialog!: DialogFormComponent;
  @ViewChild(PublishFormComponent) publishForm!: PublishFormComponent;
  @ViewChild('suscribe_dialog') suscribeDialog!: DialogFormComponent;
  @ViewChild(SuscribeFormComponent) suscribeForm!: SuscribeFormComponent;

  public services!: Observable<Paginable<ServiceLite>>;

  public suscribePointer!: string;
  public suscribeNext!: Callback<String>;

  constructor(private service: RustDbManagerService) {}

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

  openSuscribeModal(pointer: string, next: Callback<String>) {
    this.suscribePointer = pointer;
    this.suscribeNext = next;
    this.suscribeDialog.openModal();
  }

  closeSuscribeModal() {
    this.suscribeDialog.closeModal();
  }

  onSuscribe() {
    this.suscribeForm.onSubmit();
  }

  remove(code: string) {
    this.service.remove(code).subscribe({
      error: (e: ResponseException) => {
        let status = e.status;
        if(status && status > 399 && status < 500) {
          this.openSuscribeModal(code, {
            func: this.remove.bind(this),
            args: code
          });
          return;
        }
        console.error(e);

        //TODO: Use custom alert infrastructure.
        alert(e);
      },
      complete: () => this.refreshServices()
    });
  }

}