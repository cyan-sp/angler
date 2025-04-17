import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AeropuertosComponent } from './aeropuertos.component';

describe('AeropuertosComponent', () => {
  let component: AeropuertosComponent;
  let fixture: ComponentFixture<AeropuertosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AeropuertosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AeropuertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
