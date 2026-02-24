export type ToastIcon = ToastVariant;
export type ToastDuration = 'short' | 'long';
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  title?: string;
  details?: string;
  variant: ToastVariant;
  duration?: ToastDuration;
}

export interface ToastInternal extends ToastProps {
  id: string;
}

export interface ToastTheme {
  color: string;
  icon: ToastIcon;
}

export const TOAST_THEMES: Record<ToastVariant, ToastTheme> = {
  success: {
    icon: 'success',
    color: 'var(--success)',
  },
  error: {
    icon: 'error',
    color: 'var(--error)',
  },
  warning: {
    icon: 'warning',
    color: 'var(--warning)',
  },
  info: {
    icon: 'info',
    color: 'var(--info)',
  },
};
