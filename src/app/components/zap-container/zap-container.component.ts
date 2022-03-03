import { Component } from '@angular/core';
import { ZapService } from 'src/lib/services/zaps/zap.service';

@Component({
  selector: 'quartz-zap-container',
  templateUrl: './zap-container.component.html',
  styleUrls: ['./zap-container.component.scss'],
})
export class ZapContainerComponent {
  constructor(public readonly zapService: ZapService) {}
}
