import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompartidoComponent } from './form-compartido.component';

describe('FormCompartidoComponent', () => {
  let component: FormCompartidoComponent;
  let fixture: ComponentFixture<FormCompartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCompartidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCompartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
