import { Component, input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'fetch-error',
  imports: [LottieComponent],
  styles: `
    .fetch-error {
      animation: slideHalfDown 0.3s ease-in-out;
    }
  `,
  template: `
    <div class="fetch-error flex flex-col items-center justify-center mb-30">
      <ng-lottie
        [options]="options"
        [width]="animationDimensions()"
        [height]="animationDimensions()"
      />
      <p class="text-center font-medium uppercase text-muted">{{ message() }}</p>
    </div>
  `,
})
export class FetchError {
  readonly message = input.required<string>();
  readonly animationDimensions = input<string>('300px');

  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/animations/error_404.json',
  };
}
