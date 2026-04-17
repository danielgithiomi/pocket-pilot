export const TargetCompletionStrategies = ['date', 'amount'] as const;
export type TargetCompletionStrategy = (typeof TargetCompletionStrategies)[number];
