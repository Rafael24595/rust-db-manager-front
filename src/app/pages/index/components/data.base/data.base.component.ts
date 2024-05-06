import { Component } from '@angular/core';
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
  selector: 'app-data.base',
  standalone: true,
  imports: [TableElementsComponent, TableDataComponent],
  templateUrl: './data.base.component.html',
  styleUrl: './data.base.component.css'
})
export class DataBaseComponent {

  public service!: string;

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService, private suscribe: ServiceSuscribeService) { }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get('id');
    const id = route ? route : "";
    this.resolver.serviceStatus(id).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          service: id,
          closeCallback: {
            func: this.exit.bind(this)
          }
        })) {
          return;
        }
        
        if(e.status != 0) {
          this.alert.alert(e.message);
        }

        console.error(e);
      },
      complete: () => {
        this.service = id;
        this.logo.set(this.service);
      }
    })
  }

  exit() {
    this.router.navigate(["service"])
  }

}