/** Shared duration for dashboard progress-style widget animations. */
export const COMPONENT_ANIMATION_DURATION_MS = 500;

export function easeOutCubic(progress: number): number {
    return 1 - Math.pow(1 - progress, 3);
}

/** Defer one frame so mounted widgets begin animating in sync after layout. */
export function deferAnimationFrame(callback: () => void): void {
    requestAnimationFrame(callback);
}
