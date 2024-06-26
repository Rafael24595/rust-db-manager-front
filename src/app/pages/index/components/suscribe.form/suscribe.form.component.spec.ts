import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscribeFormComponent } from './suscribe.form.component';

describe('SuscribeFormComponent', () => {
  let component: SuscribeFormComponent;
  let fixture: ComponentFixture<SuscribeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuscribeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuscribeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});