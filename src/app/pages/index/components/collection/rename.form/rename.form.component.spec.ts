import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFormComponent } from './rename.form.component';

describe('RenameFormComponent', () => {
  let component: RenameFormComponent;
  let fixture: ComponentFixture<RenameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
