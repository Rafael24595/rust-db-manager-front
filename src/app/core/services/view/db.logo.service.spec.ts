import { TestBed } from '@angular/core/testing';

import { DbLogoService } from './db.logo.service';

describe('DbLogoService', () => {
  let service: DbLogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbLogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});