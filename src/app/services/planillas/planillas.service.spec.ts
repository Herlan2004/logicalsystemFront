/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanillasService } from './planillas.service';

describe('Service: Planillas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanillasService]
    });
  });

  it('should ...', inject([PlanillasService], (service: PlanillasService) => {
    expect(service).toBeTruthy();
  }));
});
