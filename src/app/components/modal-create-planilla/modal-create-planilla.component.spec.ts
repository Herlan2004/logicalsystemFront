import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreatePlanillaComponent } from './modal-create-planilla.component';

describe('ModalCreatePlanillaComponent', () => {
  let component: ModalCreatePlanillaComponent;
  let fixture: ComponentFixture<ModalCreatePlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreatePlanillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreatePlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
