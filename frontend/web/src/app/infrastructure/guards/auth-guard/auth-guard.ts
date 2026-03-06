import { CanActivateFn } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  // TODO: Implement authentication logic
  console.log('Auth guard triggered', route, state);
  return true;
};
