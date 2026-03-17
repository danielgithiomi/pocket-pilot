import { Router } from '@angular/router';
import { WEB_ROUTES } from '@global/constants';
import { Component, inject } from '@angular/core';
import { Button } from '@components/ui/atoms/button';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.html',
  imports: [LottieComponent, Button],
  styles: `
    #not-found {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }

    .lottie-animation {
      animation: slideHalfDown 0.5s ease-in-out;
    }
  `,
})
export class NotFound {
  protected readonly router: Router = inject(Router);

  protected readonly animationDimensions: string = '350px';

  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/animations/not_found.json',
  };

  navigateToSafety() {
    this.router.navigateByUrl(WEB_ROUTES.dashboard);
  }
}
