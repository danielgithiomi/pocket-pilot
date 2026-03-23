import { Component, input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'fetch-error',
  imports: [LottieComponent],
  styles: `
    @reference 'tailwindcss';

    .fetch-error {
      @apply grid place-items-center;
      animation: slideHalfDown 0.3s ease-in-out;
    }
  `,
  template: `
    <div class="fetch-error">
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
