export interface TableColumn<T> {
  key: keyof T | 'actions';
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cellTemplate?: (item: T) => string;
}

export type TableAlign = 'left' | 'center' | 'right';
