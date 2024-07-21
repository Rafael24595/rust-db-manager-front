import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboActionsComponent } from './combo.actions.component';

describe('ComboActionsComponent', () => {
  let component: ComboActionsComponent;
  let fixture: ComponentFixture<ComboActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
