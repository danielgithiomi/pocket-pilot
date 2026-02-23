import { ToastInternal } from './toast.types';
import { input, output, OnInit, OnDestroy, Component } from '@angular/core';

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
  styleUrl: './toast.css',
})
export class Toast implements OnInit, OnDestroy {
  toast = input.required<ToastInternal>();
  closed = output<void>();

  private timeoutId?: ReturnType<typeof setTimeout>;
  private startTime = 0;
  private elapsed = 0;

  isPaused = false;
  remaining = 4000;

  private get durationMs() {
    return this.toast().duration === 'long' ? 7000 : 40000;
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
