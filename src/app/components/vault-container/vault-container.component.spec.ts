import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultContainerComponent } from './vault-container.component';

describe('VaultContainerComponent', () => {
  let component: VaultContainerComponent;
  let fixture: ComponentFixture<VaultContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
