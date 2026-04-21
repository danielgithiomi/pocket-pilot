import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { WEB_ROUTES } from '@global/constants';
import { AuthMutation } from '@methods/mutations';
import { HttpClient } from '@angular/common/http';
import { concatUrl } from '@methods/methods.utils';
import { catchError, EMPTY, firstValueFrom, tap } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { STORED_AUTH_USER_KEY, STORED_ONBOARDING_USER_KEY } from '@libs/constants';
import { User, LoginPayload, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly mutation = inject(AuthMutation);
  private readonly toastService = inject(ToastService);
  private readonly http: HttpClient = inject(HttpClient);

  private sessionLoaded = signal<boolean>(false);
  private sessionLoading = signal<boolean>(false);
  private sessionRequest: Promise<boolean> | null = null;
  private readonly userSignal = signal<User | null>(null);

  // Public signals
  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.userSignal());
  isLoading = computed(() => this.sessionLoading() && !this.sessionLoaded());

  constructor() {
    // Get cached user from session storage
    const cachedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
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
          this.router.navigateByUrl(WEB_ROUTES.login);
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
        this.http.get<IStandardResponse<User>>(concatUrl('auth/me'), {
          credentials: 'include',
        }),
      );

      const { data: user } = response;
      this.createSession(user);
    } catch (error) {
      this.clearSession();
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
        const response = await firstValueFrom(
          this.http.get<IStandardResponse<User>>(concatUrl('auth/me'), {
            credentials: 'include',
          }),
        );

        const { data: user } = response;
        this.createSession(user);
        return true;
      } catch {
        this.clearSession();
        return false;
      } finally {
        this.sessionLoaded.set(true);
        this.sessionLoading.set(false);
        this.sessionRequest = null;
      }
    })();

    return this.sessionRequest;
  }

  async isUserOnboarded(): Promise<boolean> {
    if (this.userSignal()) return this.userSignal()!.isOnboarded;

    const isAuthenticated = await this.checkSession();
    if (!isAuthenticated) return false;

    return this.userSignal()!.isOnboarded;
  }

  login(request: LoginPayload) {
    return this.mutation.login(request).pipe(
      tap((response: IStandardResponse<User>) => {
        this.createSession(response.data);
      }),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  logout() {
    return this.mutation.logout().pipe(
      tap(() => this.clearSession()),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  clearSession() {
    this.userSignal.set(null);
    localStorage.removeItem(STORED_AUTH_USER_KEY);
    localStorage.removeItem(STORED_ONBOARDING_USER_KEY);
  }

  createSession(user: User) {
    this.userSignal.set(user);
    localStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(user));
  }

  refreshSession(user: User) {
    this.clearSession();
    this.createSession(user);
  }

  reinitializeSession() {
    this.clearSession();
    this.initializeSession();
  }

  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      variant: 'error',
      details: details as string,
    });
  };
}
