import { signal } from '@angular/core';
import { Injectable } from '@angular/core';
import { ToastProps, ToastInternal } from './toast.types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<ToastInternal[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(config: ToastProps) {
    const id = crypto.randomUUID();

    const toast: ToastInternal = {
      ...config,
      duration: config.duration ?? 'short',
      id,
    };

    if (this.checkSessionToastAlreadyExists(this._toasts(), toast)) {
      console.log(`Toast with title: ${toast.title} already exists. Skipping... ${toast.id} `)
      return;
    }

    this._toasts.update((prev) => [...prev, toast]);
  }

  remove(id: string) {
    this._toasts.update((prev) => prev.filter((t) => t.id !== id));
  }

  private checkSessionToastAlreadyExists(toasts: ToastInternal[], toast: ToastInternal) : boolean {
    if (!toast || toast.title === undefined) return false;

    const toastsLength: number = toasts.length;
    if (toastsLength === 0) return false;

    const singleToastTitle: string[] = [
      "Session expired. Login again!"
    ]

    return singleToastTitle.includes(toast.title);
  }
}
