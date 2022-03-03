import { Component, Input, OnInit } from '@angular/core';
import { TokenPriceInfo } from 'src/lib/types/token.types';

@Component({
  selector: 'quartz-price-button',
  templateUrl: './price-button.component.html',
  styleUrls: ['./price-button.component.scss'],
})
export class PriceButtonComponent implements OnInit {
  @Input() priceInfo: TokenPriceInfo;

  constructor() {}

  ngOnInit(): void {}

  openPriceLink() {
    if (this.priceInfo.priceLink) {
      window.open(this.priceInfo.priceLink, '__blank');
    }
  }
}
