/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArmasService } from './armas.service';

describe('Service: Armas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArmasService]
    });
  });

  it('should ...', inject([ArmasService], (service: ArmasService) => {
    expect(service).toBeTruthy();
  }));
});
