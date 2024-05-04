import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { AlertService } from '../../../../core/services/alert.service';
import { ServiceSuscribeService } from '../../../../core/services/service.suscribe.service';

@Component({
  selector: 'app-data.base',
  standalone: true,
  imports: [],
  templateUrl: './data.base.component.html',
  styleUrl: './data.base.component.css'
})
export class DataBaseComponent {

  public dataBase!: string;

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private service: RustDbManagerService, private serviceSuscribe: ServiceSuscribeService) { }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get('id');
    const id = route ? route : "";
    this.service.serviceStatus(id).subscribe({
      error: (e: ResponseException) => {
        let status = e.status;
        if(status == 404) {
          this.alert.alert(`Service ${id} not found.`);
          this.exit();
          return;
        }

        if(status && status > 399 && status < 500) {
          this.serviceSuscribe.suscribe({
            service: id,
            closeCallback: {
              func: this.exit.bind(this)
            }
          });
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => this.dataBase = id
    })
  }

  exit() {
    this.router.navigate(["services"])
  }

}