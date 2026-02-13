import {Component, input} from '@angular/core';

@Component({
  imports: [],
  selector: 'auth-feature',
  templateUrl: './auth-feature.html'
})
export class AuthFeature {

  feature = input.required<string>();

}
