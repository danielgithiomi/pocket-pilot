export type BadgeVariant = 'info' | 'success' | 'warning' | 'neutral';

export const BADGE_STYLES: Record<BadgeVariant, string> = {
    info: 'bg-(--info)/50 text-white/75 ring-(--info)/75',
    neutral: 'bg-(--dark)/50 text-white/75 ring-(--dark)/75',
    warning: 'bg-(--warning)/50 text-white/75 ring-(--warning)/75',
    success: 'bg-(--success)/50 text-white/75 ring-(--success)/75',
};