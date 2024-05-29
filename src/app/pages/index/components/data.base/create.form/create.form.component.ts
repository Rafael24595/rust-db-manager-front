import { Component, Input, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { GenerateDatabaseQuery } from '../../../../../interfaces/server/data.base/generate.data.base.quey';
import { FormsModule } from '@angular/forms';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { Callback } from '../../../../../interfaces/callback';
import { UtilsService } from '../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [FormsModule, DialogFormComponent],
  templateUrl: './create.form.component.html',
  styleUrl: './create.form.component.css'
})
export class CreateFormComponent {

  @ViewChild('form_dialog') 
  private formDialog!: DialogFormComponent;

  @Input() 
  public service!: string;
  @Input() 
  public onSubmit!: Callback;

  protected dataBase: string;

  public constructor(private utils: UtilsService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.dataBase = "";
  }

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected formSubmit(attemps: number = 0): void {
    const request: GenerateDatabaseQuery = {
      data_base: this.dataBase
    };
    
    this.resolver.dataBaseInsert(this.service, request).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Service",
          name: this.service,
          service: this.service,
          nextCallback: {
            func: this.formSubmit.bind(this)
          }
        })) {
          return;
        }

        this.handler.requestAttemp(e, this.formSubmit.bind(this), attemps);
      },
      complete: () => {
        this.utils.executeCallback(this.onSubmit);
        this.closeModal();
        this.cleanForm();
      }
    });
  }

  private cleanForm(): void {
    this.dataBase = "";
  }

}