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

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule, DialogFormComponent, FilterElementPreviewComponent],
  templateUrl: './filter.form.component.html',
  styleUrl: './filter.form.component.css'
})
export class FilterFormComponent {

  @ViewChild('form_dialog') 
  private formDialog!: DialogFormComponent;

  @Input() 
  public onSubmit!: Callback;
  
  protected resources!: Observable<FilterResources>;
  
  public filter!: FilterElement;
  public cursor!: FilterElement;

  protected name: string;
  protected direction: boolean;
  protected negation: boolean;
  protected category: string;
  protected value: string;
  
  public constructor(private resolver: RustDbManagerService) {
    this.name = "";
    this.direction = true;
    this.negation = false;
    this.category = "";
    this.value = "";
  }

  protected ngOnInit(): void {
    this.resources = this.resolver.resourcesFilter();
    this.emptyFilter();
  }

  private emptyFilter(): void {
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

  public openModal(): void {
    this.formDialog.openModal();
  }

  public closeModal(): void {
    this.formDialog.closeModal();
  }

  protected formSubmit(): void {
    console.log(this.filter)
  }

  protected addValue(): void {
    this.cursor.value.children.push({
      key: this.name,
      negation: this.negation,
      direction: this.direction,
      value: {
        category: this.category,
        value: this.value,
        attributes: [],
        children: []
      }
    });
  }

  private cleanForm(): void {
    this.name = "";
    this.direction = true;
    this.negation = false;
    this.category = "";
    this.value = "";
  }

}