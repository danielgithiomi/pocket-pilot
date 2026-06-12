import { ToastContainer } from '@atoms/toast';
import { RouterOutlet } from '@angular/router';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@api/auth.service';

@Component({
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
    imports: [RouterOutlet, ToastContainer]
})
export class App {
    protected readonly authService: AuthService = inject(AuthService);
    protected isLoading = computed<boolean>(() => this.authService.isLoading());
}
