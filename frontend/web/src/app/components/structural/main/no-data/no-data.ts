import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'no-data',
  imports: [LottieComponent, NgClass],
  styles: `
    .no-data {
      animation: slideHalfDown 0.3s ease-in-out;
    }
  `,
  template: `
    <div class="no-data flex flex-col items-center justify-center">
      <ng-lottie
        [options]="options"
        [width]="animationDimensions()"
        [height]="animationDimensions()"
      />
      <p class="text-center font-medium uppercase text-muted" [ngClass]="messageClass()">
        {{ message() }}
      </p>
    </div>
  `,
})
export class NoData {
  readonly messageClass = input<string>('');
  readonly message = input.required<string>();
  readonly animationDimensions = input<string>('300px');

  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/animations/no_data.json',
  };
}
