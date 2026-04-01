export interface CostAnalysisCategory {
  color: string;
  percentage: number;
  categoryName: string;
}

// VALUES
export const COLOR_MAP: string[] = [
  '#f59e0b',
  '#fbbf24',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#22c55e',
  '#d1d5db',
] as const;