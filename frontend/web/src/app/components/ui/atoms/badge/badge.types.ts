export type BadgeVariant = 'primary' | 'secondary' | 'tertiary';

export const BADGE_STYLES: Record<BadgeVariant, string> = {
    tertiary: 'bg-(--info)/50 text-white/75 ring-(--info)/75',
    primary: 'bg-(--warning)/50 text-white/75 ring-(--warning)/75',
    secondary: 'bg-(--success)/50 text-white/75 ring-(--success)/75',
};