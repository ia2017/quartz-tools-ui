import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapContainerComponent } from './swap-container.component';

describe('SwapContainerComponent', () => {
  let component: SwapContainerComponent;
  let fixture: ComponentFixture<SwapContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwapContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
