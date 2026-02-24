import { ToastContainer } from '@atoms/toast';
import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  imports: [RouterOutlet, ToastContainer],
})
export class App {
  protected readonly title = signal('web');
}
