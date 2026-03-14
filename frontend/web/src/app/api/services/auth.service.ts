import { catchError, EMPTY, firstValueFrom } from 'rxjs';
import { ToastService } from '@atoms/toast';
import { AuthMutation } from '@methods/mutations';
import { STORED_AUTH_USER_KEY } from '@libs/constants';
import { ILoginRequest, IStandardError, User } from '@global/types';
import { computed, inject, Injectable, signal } from '@angular/core';
import { UserResource } from '@methods/resources';
import { HttpClient } from '@angular/common/http';
import { concatUrl } from '@methods/methods.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly mutation = inject(AuthMutation);
  private readonly resource = inject(UserResource);
  private readonly toastService = inject(ToastService);

  private sessionLoaded = signal<boolean>(false);
  private sessionLoading = signal<boolean>(false);
  private sessionRequest: Promise<boolean> | null = null;
  private readonly userSignal = signal<User | null>(null);

  // Public signals
  user = computed(() => this.userSignal());
  isLoading = computed(() => this.sessionLoading());
  isAuthenticated = computed(() => !!this.userSignal());

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
      const user = await firstValueFrom(
        this.http.get<User>(concatUrl('auth/me'), {
          credentials: 'include',
        }),
      );;

      if (!user) throw new Error('Auth Service Init: User not found');

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
