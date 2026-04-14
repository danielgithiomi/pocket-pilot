import { inject } from '@angular/core';
import { AuthService } from '@api/auth.service';
import { CanMatchFn, Router } from '@angular/router';
import { WEB_ROUTES as routes } from '@global/constants';

export const OnboardedGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isOnboarded = await authService.isUserOnboarded();
  if (!isOnboarded) return router.createUrlTree([routes.onboarding]);

  return true;
};
