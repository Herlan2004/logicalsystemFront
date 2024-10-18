import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdatePlanillaComponent } from './modal-update-planilla.component';

describe('ModalUpdatePlanillaComponent', () => {
  let component: ModalUpdatePlanillaComponent;
  let fixture: ComponentFixture<ModalUpdatePlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUpdatePlanillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpdatePlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
