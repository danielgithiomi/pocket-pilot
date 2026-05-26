export type BadgeVariant = 'info' | 'success' | 'warning' | 'neutral';

export const BADGE_STYLES: Record<BadgeVariant, string> = {
    info: 'bg-(--info)/50 ring-(--info)/75',
    neutral: 'bg-(--dark)/50 ring-(--dark)/75',
    warning: 'bg-(--warning)/50 ring-(--warning)/75',
    success: 'bg-(--success)/50 ring-(--success)/75',
};