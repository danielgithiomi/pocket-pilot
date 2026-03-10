export type IconDirection = 'up' | 'down' | 'left' | 'right';

export const ROTATION_MAP: Record<IconDirection, number> = {
  up: 180,
  right: 270,
  down: 0,
  left: 90,
};
