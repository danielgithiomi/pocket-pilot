import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '@infrastructure/services';

export const AuthGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  const email = authService.userSignal();

  console.log('User found: ', email);

  if (email) return false;

  return true;
};
