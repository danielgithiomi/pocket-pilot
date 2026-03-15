import { ToastService } from '@atoms/toast';
import { AuthMutation } from '@methods/mutations';
import { HttpClient } from '@angular/common/http';
import { concatUrl } from '@methods/methods.utils';
import { STORED_AUTH_USER_KEY } from '@libs/constants';
import { catchError, EMPTY, firstValueFrom, tap } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  User,
  IAuthResponse,
  ILoginRequest,
  IStandardError,
  IStandardResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mutation = inject(AuthMutation);
  private readonly toastService = inject(ToastService);
  private readonly http: HttpClient = inject(HttpClient);

  private sessionLoaded = signal<boolean>(false);
  private sessionLoading = signal<boolean>(false);
  private sessionRequest: Promise<boolean> | null = null;
  private readonly userSignal = signal<User | null>(null);

  // Public signals
  user = computed(() => {
    console.log('user', this.userSignal());
    return this.userSignal();
  });
  isLoading = computed(() => {
    console.log('isLoading', this.sessionLoading());
    return this.sessionLoading();
  });
  isAuthenticated = computed(() => {
    console.log('isAuthenticated', !!this.userSignal());
    return !!this.userSignal();
  });

  constructor() {
    // Get cached user from session storage
    const cachedUser = sessionStorage.getItem(STORED_AUTH_USER_KEY);
    if (cachedUser) {
      this.sessionLoaded.set(true);
      this.userSignal.set(JSON.parse(cachedUser));
    }

    // Listen to cross-tab session changes
    window.addEventListener('storage', (event) => {
      if (event.key === STORED_AUTH_USER_KEY) {
        if (event.newValue) {
          this.userSignal.set(JSON.parse(event.newValue));
        } else {
          this.userSignal.set(null);
        }
      }
    });
  }

  async initializeSession(): Promise<void> {
    if (this.sessionLoaded() && this.userSignal()) return;
    if (this.sessionLoading()) return;

    this.sessionLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.get<IStandardResponse<IAuthResponse>>(concatUrl('auth/me'), {
          credentials: 'include',
        }),
      );

      if (!response) throw new Error('Auth Service Init: No response found');

      const { data: user } = response;
      this.userSignal.set(user);
      sessionStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
      this.userSignal.set(null);
      sessionStorage.removeItem(STORED_AUTH_USER_KEY);
    } finally {
      this.sessionLoaded.set(true);
      this.sessionLoading.set(false);
    }
  }

  async checkSession(): Promise<boolean> {
    if (this.userSignal()) return true;
    if (this.sessionLoaded() && !this.userSignal()) return false;
    if (this.sessionRequest) return this.sessionRequest;

    this.sessionLoading.set(true);

    this.sessionRequest = (async () => {
      try {
        const user = await firstValueFrom(
          this.http.get<User>(concatUrl('auth/me'), {
            credentials: 'include',
          }),
        );

        this.userSignal.set(user);
        sessionStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(user));
        return true;
      } catch {
        this.userSignal.set(null);
        sessionStorage.removeItem(STORED_AUTH_USER_KEY);

        return false;
      } finally {
        this.sessionLoaded.set(true);
        this.sessionLoading.set(false);
        this.sessionRequest = null;
      }
    })();

    return this.sessionRequest;
  }

  login(request: ILoginRequest) {
    return this.mutation.login(request).pipe(
      tap((response: IStandardResponse<IAuthResponse>) => {
        this.userSignal.set(response.data);
        sessionStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(response.data));
      }),
      tap(() => this.initializeSession()),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  logout() {
    return this.mutation.logout().pipe(
      tap(() => {
        this.userSignal.set(null);
        sessionStorage.removeItem(STORED_AUTH_USER_KEY);
      }),
      tap(() => this.initializeSession()),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };
}
