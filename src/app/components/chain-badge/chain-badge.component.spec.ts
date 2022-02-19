import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainBadgeComponent } from './chain-badge.component';

describe('ChainBadgeComponent', () => {
  let component: ChainBadgeComponent;
  let fixture: ComponentFixture<ChainBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChainBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
