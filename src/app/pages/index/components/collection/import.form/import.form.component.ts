import { Component, Input, ViewChild } from '@angular/core';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Callback } from '../../../../../interfaces/callback';

@Component({
  selector: 'app-import-form',
  standalone: true,
  imports: [DialogFormComponent],
  templateUrl: './import.form.component.html',
  styleUrl: './import.form.component.css'
})
export class ImportFormComponent {

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

  protected documents: string[];

  public constructor(private alert: AlertService, private utils: UtilsService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.documents = [];
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const contents = (e.target as FileReader).result as string;
        this.parseFile(contents);
      };
      
      reader.readAsText(file);
    }
  }

  private parseFile(contents: string): void {
    try {
      const data = JSON.parse(contents);
      const vector = Array.isArray(data) ? data : [data];
      //TODO: Valide structure schema.
      this.documents = vector.map(d => JSON.stringify(d));
    } catch (error) {
      this.alert.alert(`Error parsing JSON: ${error}`);
    }
  }

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected submitForm(): void {
    this.resolver.collectionImport(this.service, this.dataBase, this.collection, this.documents).subscribe({
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
        this.alert.message(`New ${this.documents.length} documents imported successfully in '${this.collection}' collection.`);
        this.closeModal();
      }
    });
  }

}