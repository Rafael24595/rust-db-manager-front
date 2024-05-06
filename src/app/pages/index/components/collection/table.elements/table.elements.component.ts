import { Component, ViewChild } from '@angular/core';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { UtilsService } from '../../../../../core/services/utils.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, DialogFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @ViewChild('form_dialog') formDialog!: DialogFormComponent;

  public service!: string;
  public dataBase!: string;

  public collections!: Observable<string[]>;

  constructor(private router: Router, private route: ActivatedRoute, private utils: UtilsService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = this.route.snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    this.refreshData();
  }

  refreshData() {
    this.collections = this.resolver.collectionFindAllLite(this.service, this.dataBase);
  }

  openModal() {
    this.formDialog.openModal();
  }

  closeModal() {
    this.formDialog.closeModal();
  }

  onSubmit() {
  }

  remove(collection: string) {
    this.resolver.collectionDrop(this.service, this.dataBase, collection).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          service: this.service,
          suscribeCallback: {
            func: this.onSubmit.bind(this)
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

  exportJson(collection: string) {
    this.resolver.collectionFindAll(this.service, this.dataBase, collection)
      .pipe(
        map(json => {
          const filename = `${this.service}-${this.dataBase}-${collection}_${Date.now()}.json`;
          this.utils.downloadFile(filename, json.join("\n"));
        })
      )
      .subscribe({
        error: (e: ResponseException) => {
          if(this.handler.autentication(e, {
            service: this.service,
            suscribeCallback: {
              func: this.onSubmit.bind(this)
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

  loadCollection(dataBase: string) {
    this.router.navigate(["/service", this.service, dataBase])
  }

}