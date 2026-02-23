// import { Component, input } from '@angular/core';
// import { ToastVariant, ToastDuration } from './toast.types';

import { OnDestroy, Component, ChangeDetectionStrategy, input, output, OnInit } from '@angular/core';
import { ToastInternal } from './toast.types';

// @Component({
//   selector: 'atom-toast',
//   standalone: true,
//   imports: [],
//   template: `
//     <div class="toast">
//       <p>Toast</p>
//     </div>
//   `,
//   styles: `
//     .toast {
//       background-color: #f3f4f6;
//       padding: 1rem;
//       border-radius: 0.5rem;
//     }
//   `,
// })
// export class Toast {
//   // Component Props
//   title = input.required<string>();
//   type = input<ToastVariant>('info');
//   message = input.required<string>();
//   duration = input<ToastDuration>('short');
// }

@Component({
  selector: 'atom-toast',
  template: `
    <div class="toast" (mouseenter)="pause()" (mouseleave)="resume()">
      <div class="content">
        <div class="text">
          @if (toast().title) {
            <p class="title">{{ toast().title }}</p>
          }
          <p class="message">{{ toast().message }}</p>
        </div>

        <button class="close" (click)="close()">✕</button>
      </div>

      <div
        class="progress"
        [style.animationDuration.ms]="remaining"
        [class.paused]="isPaused"
      ></div>
    </div>
  `,
  styles: [
    `
      .toast {
        width: 360px;
        border-radius: 12px;
        background: #1f2937;
        color: white;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        will-change: transform, opacity;
      }

      .content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 12px 14px;
        gap: 12px;
      }

      .text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .title {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .message {
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        font-size: 16px;
      }

      .progress {
        height: 3px;
        background: #22c55e;
        width: 100%;
        transform-origin: left;
        animation-name: shrink;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }

      .progress.paused {
        animation-play-state: paused;
      }

      @keyframes shrink {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
    `,
  ],
})
export class Toast implements OnInit, OnDestroy {
  // @Input({ required: true }) toast!: ToastInternal;
  // @Output() closed = new EventEmitter<void>();

  toast = input.required<ToastInternal>();
  closed = output<void>();

  private timeoutId?: ReturnType<typeof setTimeout>;
  private startTime = 0;
  private elapsed = 0;

  isPaused = false;
  remaining = 4000;

  private get durationMs() {
    return this.toast().duration === 'long' ? 7000 : 4000;
  }

  ngOnInit() {
    this.remaining = this.durationMs;
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private startTimer() {
    this.startTime = Date.now();
    this.timeoutId = setTimeout(() => {
      this.close();
    }, this.remaining);
  }

  private clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  pause() {
    if (this.isPaused) return;

    this.isPaused = true;
    this.clearTimer();

    this.elapsed += Date.now() - this.startTime;
    this.remaining = this.durationMs - this.elapsed;
  }

  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.startTimer();
  }

  close() {
    this.clearTimer();
    this.closed.emit();
  }
}