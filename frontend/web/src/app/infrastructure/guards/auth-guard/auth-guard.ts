import { inject } from '@angular/core';
import { AuthService } from '@api/auth.service';
import { CanMatchFn, Router } from '@angular/router';

export const AuthGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const allowed = await authService.checkSession();

  return allowed ? true : router.createUrlTree(['/auth/login']);
};
