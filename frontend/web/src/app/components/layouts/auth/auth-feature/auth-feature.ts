import {NgClass} from '@angular/common';
import {Component, Input, input, InputSignal} from '@angular/core';
import {CircleCheck} from '@atoms/icons';

@Component({
  imports: [NgClass, CircleCheck],
  selector: 'auth-feature',
  template: `
    <div class="flex flex-row items-center gap-3" [ngClass]="contentOrder == 'reversed' ? 'flex-row-reverse' : 'flex-row'">
      <icon-circle-check [ngClass]="contentOrder === 'normal' ? 'rotate-0' : 'rotate-180'"/>
      <p [class]="textColor">{{ feature() }}</p>
    </div>
  `,
})
export class AuthFeature {
  @Input() textColor: string = 'text-white';
  @Input() contentOrder: 'normal' | 'reversed' = 'normal';
  feature: InputSignal<string> = input.required<string>();
}
