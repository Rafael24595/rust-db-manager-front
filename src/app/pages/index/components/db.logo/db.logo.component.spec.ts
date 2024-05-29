import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbLogoComponent } from './db.logo.component';

describe('DbLogoComponent', () => {
  let component: DbLogoComponent;
  let fixture: ComponentFixture<DbLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbLogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
