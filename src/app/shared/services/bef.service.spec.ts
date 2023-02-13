import { TestBed } from '@angular/core/testing';

import { BefService } from './bef.service';

describe('BefService', () => {
  let service: BefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
