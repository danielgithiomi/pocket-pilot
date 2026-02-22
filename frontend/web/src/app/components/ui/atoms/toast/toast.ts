import { Component, input } from '@angular/core';
import { ToastType, ToastDuration } from './toast.types';

@Component({
  selector: 'atom-toast',
  standalone: true,
  imports: [],
  template: `
    <div class="toast">
      <p>Toast</p>
    </div>
  `,
  styles: `
    .toast {
      background-color: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
    }
  `,
})
export class Toast {
  // Component Props
  protected type = input<ToastType>('info');
  protected title = input.required<string>();
  protected message = input.required<string>();
  protected duration = input<ToastDuration>('short');
}
