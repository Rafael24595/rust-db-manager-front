import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { AlertService } from '../../../../core/services/alert.service';
import { ServiceSuscribeService } from '../../../../core/services/service.suscribe.service';
import { TableElementsComponent } from './table.elements/table.elements.component';
import { TableDataComponent } from './table.data/table.data.component';
import { DbLogoService } from '../../../../core/services/db.logo.service';
import { ResponseHandlerService } from '../../../../core/services/response.handler.service';

@Component({
  selector: 'app-data-base',
  standalone: true,
  imports: [TableElementsComponent, TableDataComponent],
  templateUrl: './data.base.component.html',
  styleUrl: './data.base.component.css'
})
export class DataBaseComponent {

  @ViewChild('table_element') tableElement!: TableElementsComponent;
  @ViewChild('table_data') tableData!: TableDataComponent;

  public service!: string;

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService, private suscribe: ServiceSuscribeService) {
  }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    const service = oService ? oService : "";
    this.resolver.serviceStatus(service).subscribe({
      error: (e: ResponseException) => {
        this.checkServiceResponse(e, service);
      },
      complete: () => {
        this.refreshData(service);
      }
    })
  }

  checkServiceResponse(e: ResponseException, service: string) {
    if(this.handler.autentication(e, {
      service: service,
      nextCallback: {
        func: this.refreshData.bind(this),
        args: [service]
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

  refreshData(service: string) {
    this.service = service;
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