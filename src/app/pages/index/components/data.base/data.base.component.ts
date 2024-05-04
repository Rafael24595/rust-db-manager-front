import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-data.base',
  standalone: true,
  imports: [],
  templateUrl: './data.base.component.html',
  styleUrl: './data.base.component.css'
})
export class DataBaseComponent {

  public dataBase!: string;

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private service: RustDbManagerService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataBase = id ? id : "";
    this.service.serviceStatus(id ? id : "").subscribe({
      error: (e: ResponseException) => {
        let status = e.status;
        if(status == 404) {
          this.alert.alert(`Service ${id} not found.`);
          this.router.navigate(["services"]);
          return;
        }

        /*if(status && status > 399 && status < 500) {
          this.openSuscribeModal(code, {
            func: this.remove.bind(this),
            args: code
          });
          return;
        }*/
        console.error(e);
        this.alert.alert(e.message);
      }
    })
  }

}