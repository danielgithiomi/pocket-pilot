export type OverlapperSize = 'sm' | 'md' | 'lg';

export interface OverlapperPalette {
    bg: string;
    fg: string;
}

export const OVERLAPPER_PALETTE: OverlapperPalette[] = [
    { bg: 'bg-sky-300', fg: 'text-sky-900' },
    { bg: 'bg-pink-300', fg: 'text-pink-900' },
    { bg: 'bg-lime-300', fg: 'text-lime-900' },
    { bg: 'bg-amber-300', fg: 'text-amber-900' },
    { bg: 'bg-violet-300', fg: 'text-violet-900' },
    { bg: 'bg-teal-300', fg: 'text-teal-900' },
    { bg: 'bg-rose-300', fg: 'text-rose-900' },
    { bg: 'bg-indigo-300', fg: 'text-indigo-900' },
];

export const OVERLAPPER_SIZE_STYLES: Record<OverlapperSize, string> = {
    sm: 'size-6 text-[10px] -ml-1.1',
    md: 'size-7 text-[11px] -ml-1.5',
    lg: 'size-9 text-sm -ml-2',
};
