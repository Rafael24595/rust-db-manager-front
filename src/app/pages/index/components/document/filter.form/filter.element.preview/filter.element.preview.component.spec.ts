import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterElementPreviewComponent } from './filter.element.preview.component';

describe('FilterElementPreviewComponent', () => {
  let component: FilterElementPreviewComponent;
  let fixture: ComponentFixture<FilterElementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterElementPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterElementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
