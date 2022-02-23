import { Component, Input, OnInit } from '@angular/core';
import { ChainBaseConfig } from 'src/lib/types/chain.types';

@Component({
  selector: 'quartz-chain-badge',
  templateUrl: './chain-badge.component.html',
  styleUrls: ['./chain-badge.component.scss'],
})
export class ChainBadgeComponent implements OnInit {
  @Input() chain: ChainBaseConfig;

  constructor() {}

  ngOnInit(): void {}
}
