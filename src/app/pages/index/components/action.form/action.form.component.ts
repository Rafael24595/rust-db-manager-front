import { Component } from '@angular/core';
import { ActionDefinition } from '../../../../interfaces/server/action/definition/action.definition';
import { ActivatedRoute } from '@angular/router';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { RedirectService } from '../../../../core/services/redirect.service';
import { AlertService } from '../../../../core/services/view/alert.service';
import { ResponseException } from '../../../../core/commons/response.exception';
import { Optional } from '../../../../types/optional';
import { DbLogoService } from '../../../../core/services/view/db.logo.service';
import { Dict } from '../../../../types/dict';
import { FormsModule } from '@angular/forms';
import { Action } from '../../../../interfaces/server/action/generate/action';
import { ActionForm } from '../../../../interfaces/server/action/generate/action.form';
import { FormField } from '../../../../interfaces/server/action/generate/form.field';
import { ComboSelectorComponent } from '../../../../components/combo.selector/combo.selector.component';
import { CommonModule } from '@angular/common';
import { ActionFormCollection } from '../../../../interfaces/server/action/definition/action.form.collection';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-action-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ComboSelectorComponent],
  templateUrl: './action.form.component.html',
  styleUrl: './action.form.component.css'
})
export class ActionFormComponent {

  protected service!: string;
  protected dataBase!: string;
  protected collection!: Optional<string>;
  protected action!: string;

  protected definition: Optional<ActionDefinition>;

  protected formFields!: Dict<Dict<any>>;
  protected actionData!: Action;

  constructor(private route: ActivatedRoute, private redirect: RedirectService, private alert: AlertService, private logo: DbLogoService, protected utils: UtilsService, private resolver: RustDbManagerService) {
  }

  public ngOnInit(): void {
    const snapshot = this.route.snapshot;
  
    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    this.collection = snapshot.paramMap.get("collection");
    const oAction = snapshot.paramMap.get("action");
    this.action = oAction ? oAction : "";

    this.refreshData();
  }

  public refreshData(): void {
    if(this.collection != null) {
      this.resolver.collectionAction(this.service, this.dataBase, this.collection, this.action).subscribe({
        error: (e: ResponseException) => {
          this.notFound(e.message);
        },
        next: (definition: ActionDefinition) => {
          this.logo.set(definition.title, this.service);
          console.log(definition)
          this.definition = definition;
          this.initializeAction(definition);
          this.initializeForm(definition);
        },
      });
      return;
    }
    this.notFound();
  }

  private initializeAction(definition: ActionDefinition) {
    this.actionData = {
      action: definition.action,
      form: []
    };
  }

  private initializeForm(definition: ActionDefinition) {
    this.formFields = {};
    for (const form of definition.form.forms) {
      if(!this.formFields[form.code]) {
        this.formFields[form.code] = {};
      }
    }
  }

  private notFound(message?: string): void {
    this.alert.alert(message ? message : "Action not found.")
    this.redirect.goToHome();
  }

  protected findForm(code: string): Optional<ActionForm> {
    return this.actionData.form.find(f => f.code = code);
  }

  protected tableSpace(forms: ActionFormCollection, index: number): string|string[]|Set<string>|{ [klass: string]: any; }|null|undefined {
    if(index == 0 && forms.forms.length > 1) {
      return "spaced-top";
    }
    if(index == forms.forms.length - 1 && forms.forms.length > 1) {
      return "spaced-bottom";
    }
    return "spaced";
  }

  protected addField(formCode: string) {
    const formValues = this.formFields[formCode];
    
    let form = this.actionData.form.find(f => f.code = formCode);
    if(!form) {
      form = { code: formCode, fields: [] };
      this.actionData.form.push(form);
    }

    const chunk: FormField[] = [];
    for (const key of Object.keys(formValues)) {
      chunk.push({
        code: key,
        value: formValues[key]
      });
    }

    form?.fields.push(chunk);

    this.cleanForm(formCode);
  }

  protected removeField(formCode: string, index: number) {
    const form = this.actionData.form.find(f => f.code = formCode);
    if(form) {
      form.fields.splice(index, 1);
    }
  }
  
  protected updateField(formCode: string, index: number) {
    this.copyField(formCode, index);
    this.removeField(formCode, index);
  }

  protected copyField(formCode: string, index: number) {
    const form = this.actionData.form.find(f => f.code = formCode);
    if(!form) {
      return;
    }

    const fields = form.fields[index];
    if(!fields) {
      return;
    }
    
    if(!this.formFields[formCode]) {
      this.formFields[formCode] = {};
    }

    for (const field of fields) {
      this.formFields[formCode][field.code] = field.value;
    }
  }

  protected cleanForm(formCode: string): void {
    this.formFields[formCode] = {};
  }

  protected exitForm() {
    throw new Error('Method not implemented.');
  }
  protected onSubmit() {
    throw new Error('Method not implemented.');
  }

}
