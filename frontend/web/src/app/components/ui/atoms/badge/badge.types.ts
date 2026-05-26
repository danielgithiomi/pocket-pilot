export type BadgeVariant = 'primary' | 'secondary' | 'tertiary';

export const BADGE_STYLES: Record<BadgeVariant, string> = {
    tertiary: 'bg-info-500/25 text-white/75 ring-info-500/30',
    primary: 'bg-warning-500/25 text-white/75 ring-warning-500/30',
    secondary: 'bg-success-500/25 text-white/75 ring-success-500/30',
};