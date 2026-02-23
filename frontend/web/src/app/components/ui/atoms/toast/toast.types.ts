export type ToastDuration = 'short' | 'long';
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: ToastDuration;
}

export interface ToastInternal extends ToastProps {
  id: string;
}
