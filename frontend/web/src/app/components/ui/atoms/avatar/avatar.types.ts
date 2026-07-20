import { ColorPalette } from '@libs/types';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-14'
};

export const INITIALS_TEXT_MAP: Record<AvatarSize, string> = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-md'
};

export interface AvatarClasses {
    avatarSize: string;
    background: string;
    foreground: string;
    initialsSize: string;
}

// AVATAR CONSTANTS
export const COLOR_PALETTE: ColorPalette[] = [
    { bg: 'bg-sky-300', fg: 'text-sky-900' },
    { bg: 'bg-pink-300', fg: 'text-pink-900' },
    { bg: 'bg-lime-300', fg: 'text-lime-900' },
    { bg: 'bg-amber-300', fg: 'text-amber-900' },
    { bg: 'bg-violet-300', fg: 'text-violet-900' },
    { bg: 'bg-teal-300', fg: 'text-teal-900' },
    { bg: 'bg-rose-300', fg: 'text-rose-900' },
    { bg: 'bg-indigo-300', fg: 'text-indigo-900' }
    // { bg: 'bg-red-400', fg: 'text-red-950' },
    // { bg: 'bg-orange-400', fg: 'text-orange-950' },
    // { bg: 'bg-amber-400', fg: 'text-amber-950' },
    // { bg: 'bg-yellow-400', fg: 'text-yellow-950' },
    // { bg: 'bg-lime-400', fg: 'text-lime-950' },
    // { bg: 'bg-green-400', fg: 'text-green-950' },
    // { bg: 'bg-teal-400', fg: 'text-teal-950' },
    // { bg: 'bg-cyan-400', fg: 'text-cyan-950' },
    // { bg: 'bg-blue-400', fg: 'text-blue-950' },
    // { bg: 'bg-indigo-400', fg: 'text-indigo-950' },
    // { bg: 'bg-violet-400', fg: 'text-violet-950' },
    // { bg: 'bg-fuchsia-400', fg: 'text-fuchsia-950' },
    // { bg: 'bg-pink-400', fg: 'text-pink-950' },
    // { bg: 'bg-stone-400', fg: 'text-stone-950' },
];
