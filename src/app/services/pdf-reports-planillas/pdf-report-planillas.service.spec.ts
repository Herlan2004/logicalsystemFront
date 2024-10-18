/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PdfReportPlanillasService } from './pdf-report-planillas.service';

describe('Service: PdfReportPlanillas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfReportPlanillasService]
    });
  });

  it('should ...', inject([PdfReportPlanillasService], (service: PdfReportPlanillasService) => {
    expect(service).toBeTruthy();
  }));
});
