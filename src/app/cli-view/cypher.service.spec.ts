import { TestBed } from '@angular/core/testing';

import { CypherService } from './cypher.service';

describe('CypherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CypherService = TestBed.get(CypherService);
    expect(service).toBeTruthy();
  });
});
