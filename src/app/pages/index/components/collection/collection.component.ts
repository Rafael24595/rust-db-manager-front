import { Component, ViewChild } from '@angular/core';
import { TableElementsComponent } from './table.elements/table.elements.component';
import { TableDataComponent } from './table.data/table.data.component';
import { ResponseException } from '../../../../core/commons/response.exception';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { DbLogoService } from '../../../../core/services/db.logo.service';
import { ResponseHandlerService } from '../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ServiceSuscribeService } from '../../../../core/services/service.suscribe.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [TableElementsComponent, TableDataComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {

  @ViewChild('table_element') tableElement!: TableElementsComponent;
  @ViewChild('table_data') tableData!: TableDataComponent;

  public service!: string;
  public dataBase!: string;

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService, private suscribe: ServiceSuscribeService) { }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    const service = oService ? oService : "";
    const oDataBase = this.route.snapshot.paramMap.get("data_base");
    const dataBase = oDataBase ? oDataBase : "";
    this.resolver.dataBaseStatus(service, dataBase).subscribe({
      error: (e: ResponseException) => {
        this.checkServiceResponse(e, service, dataBase);
      },
      complete: () => {
        this.refreshData(service, dataBase);
      }
    });
  }

  checkServiceResponse(e: ResponseException, service: string, dataBase: string) {
    if(this.handler.autentication(e, {
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

  refreshData(service: string, dataBase: string) {
    this.service = service;
    this.dataBase = dataBase;
    this.logo.set(this.service);
  }

  refreshChilds() {
    this.tableElement.refreshData();
    this.tableData.refreshData()
  }

  exit() {
    this.router.navigate(["service"])
  }

}