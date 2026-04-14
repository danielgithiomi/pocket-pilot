import { inject } from '@angular/core';
import { AuthService } from '@api/auth.service';
import { CanMatchFn, Router } from '@angular/router';
import { WEB_ROUTES as routes } from '@global/constants';
import { ToastService } from '@components/ui/atoms/toast';

export const AuthGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const toastService: ToastService = inject(ToastService);

  const allowed = await authService.checkSession();

  if (!allowed) return router.createUrlTree([routes.login]);

  return allowed;
};
