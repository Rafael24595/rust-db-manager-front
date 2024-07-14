import { Component, Input, ViewChild } from '@angular/core';
import { FilterElement } from '../../../../../interfaces/server/field/filter/filter.element';
import { FormsModule } from '@angular/forms';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { Callback } from '../../../../../interfaces/callback';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { FilterResources } from '../../../../../interfaces/server/field/filter/filter.resources';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FilterElementPreviewComponent } from './filter.element.preview/filter.element.preview.component';
import { FilterDefinition } from '../../../../../interfaces/server/field/filter/definition/filter.definition';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { FilterValueAttribute } from '../../../../../interfaces/server/field/filter/filter.value.attribute';
import { FilterAttributeDefinition } from '../../../../../interfaces/server/field/filter/definition/filter.attribute.definition';
import { FilterAttributeDefaultDefinition } from '../../../../../interfaces/server/field/filter/definition/filter.attribute.default.definition';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseException } from '../../../../../core/commons/response.exception';

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule, DialogFormComponent, FilterElementPreviewComponent, CodemirrorModule],
  templateUrl: './filter.form.component.html',
  styleUrl: './filter.form.component.css'
})
export class FilterFormComponent {

  @ViewChild('form_dialog') 
  private formDialog!: DialogFormComponent;

  @Input() 
  public onSubmit!: Callback;
  
  protected resources!: Observable<FilterResources>;
  protected schema!: FilterDefinition;
  
  public filter!: FilterElement;
  public cursor!: FilterElement;

  protected service!: string;

  protected name: string;
  protected direction: boolean;
  protected negation: boolean;
  protected category: string;
  protected value: string;

  protected attributes: FilterValueAttribute[];

  protected query = "";

  public options = {
    mode: "application/ld+json",
    lineNumbers: false,
    lineWrapping: false,
    foldGutter: true,
    gutters: ['CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };
  
  public constructor(private route: ActivatedRoute, private alert: AlertService, public utils: UtilsService, private resolver: RustDbManagerService) {
    this.name = "";
    this.direction = true;
    this.negation = false;
    this.category = "";
    this.value = "";
    this.attributes = [];
  }

  protected ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    this.resources = this.resolver.resourcesFilter();
    this.loadEmptyFilter();
    this.loadFilterDefinition();
  }

  protected loadEmptyFilter(): void {
    this.resolver.resourcesFilter().subscribe((value: FilterResources) => {
      this.filter = {
        key: "",
        value: {
          category: value.root_category,
          value: "",
          attributes: [],
          children: []
        },
        direction: true,
        negation: false
      };
      this.cursor = this.filter;
    });
  }

  private loadFilterDefinition(): void {
    this.resolver.serviceSchemaFilter(this.service).subscribe({
      error: (e: ResponseException) => {
        this.alert.alert(e.message);
      },
      next: (schema: FilterDefinition) => {
        this.schema = schema;
        if(this.schema.query_type == "JSON") {
          this.options.mode = "application/ld+json";
        }
      }
    });
  }

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected formSubmit(): void {
    this.cleanForm();
    this.onSubmit.func(this.filter);
  }

  protected addValue(): void {
    this.cursor.value.children.push({
      key: this.name,
      negation: this.negation,
      direction: this.direction,
      value: {
        category: this.category,
        value: this.value,
        attributes: this.attributes,
        children: []
      }
    });
    this.cleanForm();
  }

  private cleanForm(): void {
    this.name = "";
    this.direction = true;
    this.negation = false;
    this.category = "";
    this.value = "";
    this.attributes = [];
  }

  protected fillForm(element: FilterElement): void {
    this.name = element.key;
    this.direction = element.direction;
    this.negation = element.negation;
    this.category = element.value.category;
    this.value = element.value.value;
    this.attributes = []; //element.value.attributes;
  }

  protected updateAttribute(event: Event, definition: FilterAttributeDefinition): void {
    const target = event.target as HTMLInputElement | undefined;
    if(!target) {
      return;
    }
    this._updateAttribute(target.value, definition);
  }

  protected _updateAttribute(value: string, definition: FilterAttributeDefinition): void {
    let attribute = this.attributes.find(a => a.key == definition.code);
    if(!attribute) {
      attribute = {
        key: definition.code,
        value: ""
      };
      this.attributes.push(attribute);
    }
    attribute.value = value;
  }

  protected filterAttributes(attributes: FilterAttributeDefinition[]): FilterAttributeDefinition[] {
    return attributes.filter(a => a.applies.includes(this.category))
  }

  protected isDefault(attribute: FilterAttributeDefinition, value: FilterAttributeDefaultDefinition): boolean {
    const cursor = this.attributes.find(a => a.key == attribute.code);
    if(!cursor) {
      return value.default;
    }
    
    const cursorValue = attribute.values.find(a => a.value == cursor.value);
    if(!cursorValue) {
      return false;
    }
    
    return true;
  }

  protected showExample() {
    let example = this.schema.query_example;
    if(this.schema.query_type == "JSON") {
      try {
        const parse = JSON.parse(this.schema.query_example);
        example = JSON.stringify(parse, null, 2)
      } catch (error) {
        this.alert.alert(`Cannot load example: ${error}`)
      }
    }
    this.value = example;
  }

  protected handleChange($event: string): void {
    this.value = $event;
  }

}