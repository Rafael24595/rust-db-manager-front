import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboSelectorComponent } from './combo.selector.component';

describe('ComboSelectorComponent', () => {
  let component: ComboSelectorComponent;
  let fixture: ComponentFixture<ComboSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
