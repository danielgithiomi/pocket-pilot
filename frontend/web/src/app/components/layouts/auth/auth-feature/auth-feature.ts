import { Component, Input, input } from '@angular/core';
import { ArrowedCircle } from '@atoms/icons/ArrowedCircle';

@Component({
  imports: [ArrowedCircle],
  selector: 'auth-feature',
  templateUrl: './auth-feature.html',
})
export class AuthFeature {
  feature = input.required<string>();
  @Input() textColor: string = 'text-white';
}
