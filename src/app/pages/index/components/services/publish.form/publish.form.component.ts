import { Component, Input, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceCategoryLite } from '../../../../../interfaces/server/service/definition/service.category.lite';
import { FormsModule } from '@angular/forms';
import { ServiceCreateRequest } from '../../../../../interfaces/server/service/generate/service.create.request';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { Callback } from '../../../../../interfaces/callback';
import { UtilsService } from '../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-publish-form',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule, DialogFormComponent],
  templateUrl: './publish.form.component.html',
  styleUrl: './publish.form.component.css'
})
export class PublishFormComponent {
  
  @ViewChild('form_dialog') 
  private formDialog!: DialogFormComponent;

  @Input() 
  public onSubmit!: Callback;

  protected categories!: Observable<ServiceCategoryLite[]>;
  
  protected category: string;
  protected name: string;
  protected connection: string;
  protected secure: boolean;

  protected showPassword: boolean;
  protected password: string;

  public constructor(private utils: UtilsService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.category = "";
    this.name = "";
    this.connection = "";
    this.secure = false;
    this.showPassword = false;
    this.password = "";
  }

  protected ngOnInit(): void {
    this.categories = this.resolver.available();
  }

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected submitForm(attemps: number = 0): void {
    const request: ServiceCreateRequest = {
      name: this.name,
      owner: "Client",
      protected: this.secure,
      password: this.password,
      connection_data: {
        category: this.category,
        connection: this.connection
      }
    };
    
    this.resolver.serviceInsert(request).subscribe({
      error: (e: ResponseException) => {
        this.handler.requestAttemp(e, this.submitForm.bind(this), attemps);
      },
      complete: () => {
        this.utils.executeCallback(this.onSubmit);
        this.closeModal();
        this.cleanForm();
      }
    });
  }

  private cleanForm(): void {
    this.category = "";
    this.name = "";
    this.connection = "";
    this.secure = false;
    this.password = "";
    this.showPassword = false;
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}