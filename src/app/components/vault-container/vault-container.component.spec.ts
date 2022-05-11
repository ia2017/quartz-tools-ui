import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultsContainerComponent } from './vault-container.component';

describe('VaultContainerComponent', () => {
  let component: VaultsContainerComponent;
  let fixture: ComponentFixture<VaultsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
