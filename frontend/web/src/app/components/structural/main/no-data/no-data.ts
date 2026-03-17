import { Component, input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'no-data',
  imports: [LottieComponent],
  template: `
    <div class="flex flex-col items-center justify-center">
      <ng-lottie
        [options]="options"
        [width]="animationDimensions()"
        [height]="animationDimensions()"
      />
      <p class="text-center font-medium uppercase text-muted">{{ message() }}</p>
    </div>
  `,
})
export class NoData {
  readonly message = input.required<string>();
  readonly animationDimensions = input<string>('300px');

  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/animations/no_data.json',
  };
}
