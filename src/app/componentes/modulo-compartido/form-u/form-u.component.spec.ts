import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUComponent } from './form-u.component';

describe('FormUComponent', () => {
  let component: FormUComponent;
  let fixture: ComponentFixture<FormUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
