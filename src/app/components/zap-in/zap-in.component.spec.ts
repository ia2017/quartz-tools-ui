import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapInComponent } from './zap-in.component';

describe('ZapInComponent', () => {
  let component: ZapInComponent;
  let fixture: ComponentFixture<ZapInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
