export interface SelectOption {
  label: string;
  disabled?: boolean;
  descriptor?: string;
  value: string | number;
}

export type SelectSize = 'sm' | 'md' | 'lg';
