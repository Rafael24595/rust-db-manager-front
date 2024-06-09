import { Component, Input } from '@angular/core';
import { FilterElement } from '../../../../../../interfaces/server/field/filter/filter.element';
import { Callback } from '../../../../../../interfaces/callback';

@Component({
  selector: 'app-filter-element-preview',
  standalone: true,
  imports: [],
  templateUrl: './filter.element.preview.component.html',
  styleUrl: './filter.element.preview.component.css'
})
export class FilterElementPreviewComponent {

  @Input() 
  public filter!: FilterElement;
  @Input() 
  public modifyCallback!: Callback;

  protected modifyField(element: FilterElement) {
    this.modifyCallback.func(element);
    this.removeField(element);
  }

  protected removeField(element: FilterElement): void {
    const index = this.filter.value.children.indexOf(element);
    if (index > -1) {
      this.filter.value.children.splice(index, 1);
    }
  }

}