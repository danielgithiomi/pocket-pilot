import { CheckedCircle, CrossIcon } from '@atoms/icons';
import { TOAST_THEMES, ToastInternal, ToastTheme, ToastVariant } from './toast.types';
import { input, output, OnInit, OnDestroy, Component, computed } from '@angular/core';

@Component({
  selector: 'atom-toast',
  template: `
    <div class="toast bg-alternate-background" (mouseenter)="pause()" (mouseleave)="resume()">
      <div class="content">
        <div class="text">
          @if (toast().title) {
            <div class="flex flex-row gap-2 items-center">
              <icon-checked-circle [color]="theme().color" />
              <p class="title">{{ toast().title }}</p>
            </div>
          }
          <p class="message">{{ toast().details }}</p>
        </div>

        <button class="close" (click)="close()">
          <icon-cross [color]="theme().color" />
        </button>
      </div>

      <div
        class="progress"
        [class.paused]="isPaused"
        [style.backgroundColor]="theme().color"
        [style.animationDuration.ms]="remaining"
      ></div>
    </div>
  `,
  styleUrl: './toast.css',
  imports: [CheckedCircle, CrossIcon],
})
export class Toast implements OnInit, OnDestroy {
  closed = output<void>();
  toast = input.required<ToastInternal>();
  theme = computed<ToastTheme>(() => TOAST_THEMES[this.toast().variant]);

  private timeoutId?: ReturnType<typeof setTimeout>;
  private startTime = 0;
  private elapsed = 0;

  isPaused = false;
  remaining = 3500;

  private get durationMs() {
    return this.toast().duration === 'long' ? 7000 : 3500;
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
