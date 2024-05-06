import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuscribeRequest } from '../../../../interfaces/request/suscribe.request';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { AlertService } from '../../../../core/services/alert.service';
import { DialogFormComponent } from '../../../../components/dialog.form/dialog.form.component';
import { ServiceSuscribeService } from '../../../../core/services/service.suscribe.service';
import { ServiceSuscribe } from '../../../../interfaces/service.suscribe';

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

  constructor(private alert: AlertService, private suscribe: ServiceSuscribeService, private resolver: RustDbManagerService) {
    this.showPassword = false;
    this.password = "";
  }

  ngOnInit(): void {
    this.suscribe.onRequest().subscribe((request: ServiceSuscribe) => {
      console.log(request)
      this.request = request;
      console.log(this.suscribeDialog)
      this.suscribeDialog.openModal();
    });
  }

  closeModal() {
    if(this.request.closeCallback) {
      const callback = this.request.closeCallback;
      callback.func(callback.args);
    }
    this.suscribeDialog.closeModal();
  }

  onSubmit() {
    const request: SuscribeRequest = {
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
        this.closeModal();
        this.cleanForm();
        if(this.request.suscribeCallback) {
          const callback = this.request.suscribeCallback;
          callback.func(callback.args);
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