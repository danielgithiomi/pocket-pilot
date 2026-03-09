import { Injectable, signal } from '@angular/core';
import { STORED_AUTH_USER_KEY } from '@libs/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly userSignal = signal<string | null>(null);

  constructor() {
    const cached = sessionStorage.getItem(STORED_AUTH_USER_KEY);

    this.userSignal.set(cached ?? 'unknown');
  }
}
