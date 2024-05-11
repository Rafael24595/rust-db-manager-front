import { TestBed } from '@angular/core/testing';

import { ServiceSuscribeService } from './service.suscribe.service';

describe('ServiceSuscribeService', () => {
  let service: ServiceSuscribeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSuscribeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});