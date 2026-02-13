import {RouterOutlet} from '@angular/router';
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('web');
}
