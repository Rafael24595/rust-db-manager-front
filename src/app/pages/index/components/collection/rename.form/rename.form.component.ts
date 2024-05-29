import { Component, Input, ViewChild } from '@angular/core';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { RenameCollectionQuery } from '../../../../../interfaces/server/collection/rename.collection.query';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { Callback } from '../../../../../interfaces/callback';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rename-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogFormComponent],
  templateUrl: './rename.form.component.html',
  styleUrl: './rename.form.component.css'
})
export class RenameFormComponent {

  @ViewChild('form_dialog') 
  private formDialog!: DialogFormComponent;

  @Input() 
  public service!: string;
  @Input() 
  public dataBase!: string;
  @Input() 
  public collection!: string;

  @Input() 
  public onSubmit!: Callback;

  protected rename: string;

  public constructor(private alert: AlertService, private utils: UtilsService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.rename = "";
  }

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected submitForm(): void {
    const request: RenameCollectionQuery = {
      collection: this.rename
    };

    this.resolver.collectionRename(this.service, this.dataBase, this.collection, request).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Collection",
          name: this.collection,
          service: this.service,
          nextCallback: {
            func: this.submitForm.bind(this)
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => {
        this.utils.executeCallback(this.onSubmit);
        this.closeModal();
      }
    });
  }

}