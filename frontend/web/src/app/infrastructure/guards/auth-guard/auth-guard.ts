import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@infrastructure/services';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService: AuthService = inject(AuthService);

  console.log('Value: ', authService.userSignal());

  // TODO: Implement authentication logic
  console.log('Auth guard triggered', route, state);
  return authService.userSignal() !== 'unknown';
};
