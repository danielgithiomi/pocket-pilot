import { inject } from '@angular/core';
import { AuthService } from '@api/auth.service';  
import { CanMatchFn, Router } from '@angular/router';

export const GuestGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowed = await authService.checkSession();

  return !allowed ? true : router.createUrlTree(['/dashboard']);
};
