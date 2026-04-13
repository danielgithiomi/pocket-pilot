export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  descriptor?: string;
}

export type SelectSize = 'sm' | 'md' | 'lg';
