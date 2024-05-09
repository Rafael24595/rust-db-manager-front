import { Component, Input } from '@angular/core';
import { AlertService } from '../../../../../core/services/alert.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { CreateDBRequest } from '../../../../../interfaces/request/create.db.request';
import { ActivatedRoute } from '@angular/router';
import { ServiceSuscribeService } from '../../../../../core/services/service.suscribe.service';
import { FormsModule } from '@angular/forms';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.form.component.html',
  styleUrl: './create.form.component.css'
})
export class CreateFormComponent {

  public service!: string;

  @Input() closeModal: Function;
  @Input() refreshData: Function;

  public dataBase: string;

  constructor(private route: ActivatedRoute, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService, private suscribe: ServiceSuscribeService) {
    this.closeModal = () => {};
    this.refreshData = () => {};
    this.dataBase = "";
  }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";
  }

  onSubmit(attemps: number = 0) {
    const request: CreateDBRequest = {
      data_base: this.dataBase
    };
    
    this.resolver.dataBaseCreate(this.service, request).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          service: this.service,
          nextCallback: {
            func: this.onSubmit.bind(this)
          }
        })) {
          return;
        }

        this.handler.requestAttemp(e, this.onSubmit.bind(this), attemps);
      },
      complete: () => {
        this.closeModal();
        this.refreshData();
        this.cleanForm();
      }
    });
  }

  cleanForm() {
    this.dataBase = "";
  }

}