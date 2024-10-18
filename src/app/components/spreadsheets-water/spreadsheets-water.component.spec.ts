import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadsheetsWaterComponent } from './spreadsheets-water.component';

describe('SpreadsheetsWaterComponent', () => {
  let component: SpreadsheetsWaterComponent;
  let fixture: ComponentFixture<SpreadsheetsWaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpreadsheetsWaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpreadsheetsWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
