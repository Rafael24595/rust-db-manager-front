import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceSuscribeRequest } from '../../../../interfaces/server/service/generate/service.suscribe.request';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { AlertService } from '../../../../core/services/view/alert.service';
import { DialogFormComponent } from '../../../../components/dialog.form/dialog.form.component';
import { ServiceSuscribeService } from '../../../../core/services/view/service.suscribe.service';
import { ServiceSuscribe } from '../../../../interfaces/service.suscribe';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-suscribe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogFormComponent],
  templateUrl: './suscribe.form.component.html',
  styleUrl: './suscribe.form.component.css'
})
export class SuscribeFormComponent {

  @ViewChild(DialogFormComponent) suscribeDialog!: DialogFormComponent;
  
  public request!: ServiceSuscribe;

  public showPassword: boolean;
  public password: string;

  constructor(private alert: AlertService, private utils: UtilsService, private suscribe: ServiceSuscribeService, private resolver: RustDbManagerService) {
    this.showPassword = false;
    this.password = "";
  }

  ngOnInit(): void {
    this.suscribe.onRequest().subscribe((request: ServiceSuscribe) => {
      this.request = request;
      this.suscribeDialog.openModal();
    });
  }

  closeModal() {
    if(this.request.exitCallback) {
      const callback = this.request.exitCallback;
      callback.func(callback.args);
    }
    this.suscribeDialog.closeModal();
  }

  onSubmit() {
    const request: ServiceSuscribeRequest = {
      name: this.request.service,
      owner: "Client",
      password: this.password
    };
    
    this.resolver.suscribe(request).subscribe({
      error: (e: ResponseException) => {
        const message = "Incorrect password."
        this.alert.alert(message);

        console.error(e);
      },
      complete: () => {
        this.suscribeDialog.closeModal();
        this.cleanForm();
        if(this.request.nextCallback) {
          this.utils.executeCallback(this.request.nextCallback);
        }
      }
    });
  }

  cleanForm() {
    this.password = "";
    this.showPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}