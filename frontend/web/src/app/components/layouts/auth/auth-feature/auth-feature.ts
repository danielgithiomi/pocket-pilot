import {NgClass} from '@angular/common';
import {Component, Input, input} from '@angular/core';
import {ArrowedCircle} from '@atoms/icons/ArrowedCircle';

@Component({
  imports: [ArrowedCircle, NgClass],
  selector: 'auth-feature',
  template: `
    <div class="flex flex-row items-center gap-3" [ngClass]="contentOrder == 'reversed' ? 'flex-row-reverse' : 'flex-row'">
      <icon-arrowed-circle/>
      <p [class]="textColor">{{ feature() }}</p>
    </div>
  `,
})
export class AuthFeature {
  @Input() textColor: string = 'text-white';
  feature = input.required<string>();
  @Input() contentOrder: 'normal' | 'reversed' = 'normal';
}
