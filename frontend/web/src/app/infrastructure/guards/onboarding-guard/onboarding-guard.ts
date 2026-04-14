import { inject } from '@angular/core';
import { ToastService } from '@atoms/toast';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { CanMatchFn, Router } from '@angular/router';

export const OnboardingGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const tempUser = localStorage.getItem('PP_ONBOARDING_USER');

  if (!tempUser) {
    await authService.checkSession();

    const user = authService.user();
    if (!user) {
      toastService.show({
        variant: 'info',
        title: 'Login required!',
        details: 'Please login to complete the onboarding process.',
      });
      return router.navigate([WEB_ROUTES.login], { replaceUrl: true });
    }

    if (user.isOnboarded) return router.navigate([WEB_ROUTES.dashboard], { replaceUrl: true });

    return true;
  }

  const user = JSON.parse(tempUser);

  if (user.onboarded) return router.createUrlTree([WEB_ROUTES.dashboard]);

  return true;
};
