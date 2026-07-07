export interface TabListItem {
    label: string;
    value: string;
}

export interface TabChangeEventOutput {
    index: number;
    value: string;
}

export type TabSize = 'sm' | 'md' | 'lg';
