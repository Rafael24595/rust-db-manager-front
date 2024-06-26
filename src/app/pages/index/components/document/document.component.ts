import { Component, ViewChild } from '@angular/core';
import { TableElementsComponent } from './table.elements/table.elements.component';
import { TableDataComponent } from './table.data/table.data.component';
import { ResponseException } from '../../../../core/commons/response.exception';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../core/services/view/alert.service';
import { DbLogoService } from '../../../../core/services/view/db.logo.service';
import { ResponseHandlerService } from '../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { RedirectService } from '../../../../core/services/redirect.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [TableElementsComponent, TableDataComponent],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent {

  @ViewChild('table_element') 
  private tableElement!: TableElementsComponent;
  @ViewChild('table_data')
  private tableData!: TableDataComponent;

  protected service!: string;
  protected dataBase!: string;
  protected collection!: string;

  public constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
  }

  public ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    const service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    const dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    const collection = oCollection ? oCollection : "";

    this.resolver.collectionMetadata(service, dataBase, collection).subscribe({
      error: (e: ResponseException) => {
        this.checkServiceResponse(e, service, dataBase);
      },
      complete: () => {
        this.refreshData(service, dataBase);
      }
    });
  }

  private checkServiceResponse(e: ResponseException, service: string, dataBase: string): void {
    if(this.handler.autentication(e, {
      key: "Collection",
      name: this.collection,
      service: service,
      nextCallback: {
        func: this.refreshData.bind(this),
        args: [service, dataBase]
      },
      exitCallback: {
        func: this.exit.bind(this)
      }
    })) {
      return;
    }
    
    if(e.status != 0) {
      this.alert.alert(e.message);
    }

    console.error(e);
  }

  private refreshData(service: string, dataBase: string): void {
    this.service = service;
    this.dataBase = dataBase;
    const title = "Viewing document";
    this.logo.set(title, this.service);
  }

  protected refreshChilds(): void {
    this.tableElement.refreshData();
    this.tableData.refreshData()
  }

  private exit(): void {
    this.redirect.goToHome();
  }

}