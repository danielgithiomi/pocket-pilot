import { Toast } from './toast';
import { Component } from '@angular/core';
import { ToastInternal } from './toast.types';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'toast-container',
  standalone: true,
  imports: [CommonModule, Toast],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '250ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  template: `
    <div class="toast-wrapper">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [@toastAnimation]>
          <atom-toast
            [toast]="toast"
            (closed)="toastService.remove(toast.id)"
          />
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-wrapper {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 9999;
        pointer-events: none;
      }

      .toast-wrapper > * {
        pointer-events: auto;
      }
    `,
  ],
})
export class ToastContainer {
  constructor(public toastService: ToastService) {}

  trackById = (_: number, toast: ToastInternal) => toast.id;
}
