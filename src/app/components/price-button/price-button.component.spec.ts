import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceButtonComponent } from './price-button.component';

describe('PriceButtonComponent', () => {
  let component: PriceButtonComponent;
  let fixture: ComponentFixture<PriceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
