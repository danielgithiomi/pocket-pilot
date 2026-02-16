import {Component, Input, input} from '@angular/core';
import {ArrowedCircle} from '@atoms/icons/ArrowedCircle';

@Component({
  imports: [ArrowedCircle],
  selector: 'auth-feature',
  template: `
    <div class="flex flex-row items-center gap-3">
      <icon-arrowed-circle/>
      <p [class]="textColor">{{ feature() }}</p>
    </div>
  `,
})
export class AuthFeature {
  feature = input.required<string>();
  @Input() textColor: string = 'text-white';
}
