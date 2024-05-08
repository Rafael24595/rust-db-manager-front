import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ServiceSuscribeService } from '../../../../../core/services/service.suscribe.service';
import { Observable, map } from 'rxjs';
import { FieldDefinition } from '../../../../../interfaces/definition/field.definition';
import { AsyncPipe } from '@angular/common';
import { FieldData } from '../../../../../interfaces/definition/field.data';
import { FormsModule } from '@angular/forms';
import { DbLogoService } from '../../../../../core/services/db.logo.service';
import { ResponseException } from '../../../../../core/commons/response.exception';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './create.form.component.html',
  styleUrl: './create.form.component.css'
})
export class CreateFormComponent {

  public service!: string;
  public dataBase!: string;

  public definitions!: FieldDefinition[];
  public fields: FieldData[];

  public collection!: string;
  public baseCode!: string;
  public base!: FieldDefinition;
  public field: FieldData | undefined

  constructor(private router: Router, private route: ActivatedRoute, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.fields = [];
  }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    const service = oService ? oService : "";
    const oDataBase = this.route.snapshot.paramMap.get("data_base");
    const dataBase = oDataBase ? oDataBase : "";
    this.resolver.serviceDefinition(service).pipe(
      map(definitions => {
        this.definitions = definitions;
        this.test()
      })
    ).subscribe({
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
      suscribeCallback: {
        func: this.refreshData.bind(this),
        args: [service, dataBase]
      },
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
  }

  refreshData(service: string, dataBase: string) {
    this.service = service;
    this.dataBase = dataBase;
    this.logo.set(this.service);
  }

  test() {
    const testdef: FieldDefinition = {
        "order": 0,
        "name": "VARCHAR",
        "code": "VARCHAR",
        "category": "STRING",
        "size": true,
        "multiple": true,
        "attributes": []
      }
      this.definitions.push(testdef)
    }

  selectBase() {
    if(this.updateBase(this.baseCode)) {
      this.newField()
    }
  }

  updateBase(code: string) {
    const definition = this.definitions.find(d => d.code == code);
    if(definition) {
      this.baseCode = code;
      this.base = definition;
    }
    return definition;
  }

  newField() {
    this.field = {
      order: this.fields.length,
      code: this.base.code,
      value: "",
      swsize: this.base.size,
      size: 0,
      attributes: this.base.attributes.map(a => {
        return  {
          key: a.code,
          value: ""
        }
      })
    }
  }

  addField() {
    if(this.field) {
      this.fields.push(this.field)
      this.field = undefined;
      this.baseCode = "default";
    }
  }

  copyField(index: number) {
    this.field = this.fields[index];
    console.log(this.field)
    this.updateBase(this.field.code);
  }

  updateField(index: number) {
    this.copyField(index)
    this.removeField(index);
  }

  removeField(index: number) {
    this.fields.splice(index, 1);
  }

  findAttribute(code: string) {
    return this.field?.attributes.find(a => a.key = code);
  }

  exit() {
    this.router.navigate(["service"])
  }

}