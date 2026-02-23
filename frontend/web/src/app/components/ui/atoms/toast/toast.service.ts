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

    this._toasts.update((prev) => [...prev, toast]);
  }

  remove(id: string) {
    this._toasts.update((prev) => prev.filter((t) => t.id !== id));
  }
}
