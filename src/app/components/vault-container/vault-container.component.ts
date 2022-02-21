import { Component } from '@angular/core';
import { VaultService } from 'src/lib/services/vaults/vault.service';

@Component({
  selector: 'quartz-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.scss'],
})
export class VaultsContainerComponent {
  constructor(public readonly vaultService: VaultService) {}
}
