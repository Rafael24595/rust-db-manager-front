import { TestBed } from '@angular/core/testing';

import { RustDbManagerService } from './rust.db.manager.service';

describe('RustDbManagerService', () => {
  let service: RustDbManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RustDbManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
