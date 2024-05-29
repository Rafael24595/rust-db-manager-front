import { TestBed } from '@angular/core/testing';

import { DocumentKeysParserService } from './document.keys.parser.service';

describe('DocumentKeysParserService', () => {
  let service: DocumentKeysParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentKeysParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
