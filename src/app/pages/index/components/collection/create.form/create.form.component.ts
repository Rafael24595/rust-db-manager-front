import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { map } from 'rxjs';
import { FieldDefinition } from '../../../../../interfaces/server/field/definition/field.definition';
import { AsyncPipe } from '@angular/common';
import { FieldData } from '../../../../../interfaces/server/field/generate/field.data';
import { FormsModule } from '@angular/forms';
import { DbLogoService } from '../../../../../core/services/view/db.logo.service';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { CollectionDefinition } from '../../../../../interfaces/server/collection/collection.definition';
import { GenerateCollectionQuery } from '../../../../../interfaces/server/collection/generate.collection.query';
import { RedirectService } from '../../../../../core/services/redirect.service';

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

  public definition!: CollectionDefinition;
  public fields: FieldData[];

  public collection!: string;
  public baseCode!: string;
  public base!: FieldDefinition;
  public field: FieldData | undefined

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private logo: DbLogoService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.fields = [];
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    const service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    const dataBase = oDataBase ? oDataBase : "";

    this.resolver.serviceDefinition(service).pipe(
      map(definition => {
        this.definition = definition;
        this.fields = this.fields.concat(this.definition.defaults);
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

  selectBase() {
    if(this.updateBase(this.baseCode)) {
      this.newField()
    }
  }

  updateBase(code: string) {
    const definition = this.definition.definition.find(d => d.code == code);
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
      swsize: this.base.swsize,
      size: 0,
      mutable: true,
      attributes: this.base.attributes.map(a => {
        return  {
          key: a.code,
          value: ""
        }
      }),
      reference: []
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
    this.field = structuredClone(this.fields[index]);
    this.field.mutable = true;
    this.updateBase(this.field.code);
  }

  updateField(index: number) {
    if(this.fields[index].mutable) { 
      this.copyField(index)
      this.removeField(index);
    }
  }

  removeField(index: number) {
    if(this.fields[index].mutable) {
      this.fields.splice(index, 1);
    }
  }

  findAttribute(code: string) {
    return this.field?.attributes.find(a => a.key == code);
  }

  valideForm(): string | undefined {
    if (this.collection == undefined || this.collection.trim() == "") {
      return "Collection field name is required."
    }
    return undefined;
  }

  onSubmit(attemps: number = 0) {
    const message = this.valideForm();
    if(message) {
      this.alert.alert(message);
      return;
    }
    const request: GenerateCollectionQuery = {
      data_base: this.dataBase,
      collection: this.collection,
      fields: this.fields
    }
    
    this.resolver.collectionCreate(this.service, request).subscribe({
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
        this.exitForm();
      }
    });
  }

  exitForm() {
    this.redirect.goToDataBase(this.service, this.dataBase);
  }

  exit() {
    this.redirect.goToHome();
  }

}