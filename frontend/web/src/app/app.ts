import { ToastContainer } from '@atoms/toast';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@api/auth.service';
import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  imports: [RouterOutlet, ToastContainer],
})
export class App {
  protected readonly authService: AuthService = inject(AuthService);
  protected isLoading = computed<boolean>(() => this.authService.isLoading());
}
