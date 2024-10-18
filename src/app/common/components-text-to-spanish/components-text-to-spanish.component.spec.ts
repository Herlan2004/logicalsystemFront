import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsTextToSpanishComponent } from './components-text-to-spanish.component';

describe('ComponentsTextToSpanishComponent', () => {
  let component: ComponentsTextToSpanishComponent;
  let fixture: ComponentFixture<ComponentsTextToSpanishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsTextToSpanishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsTextToSpanishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
