import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHistorialesClinicosComponent } from './listado-historiales-clinicos.component';

describe('ListadoHistorialesClinicosComponent', () => {
  let component: ListadoHistorialesClinicosComponent;
  let fixture: ComponentFixture<ListadoHistorialesClinicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoHistorialesClinicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoHistorialesClinicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
