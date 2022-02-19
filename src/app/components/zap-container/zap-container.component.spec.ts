import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapContainerComponent } from './zap-container.component';

describe('ZapContainerComponent', () => {
  let component: ZapContainerComponent;
  let fixture: ComponentFixture<ZapContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
