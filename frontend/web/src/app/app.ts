import { Component } from '@angular/core';
import { ToastContainer } from '@atoms/toast';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, ToastContainer],
})
export class App {}
