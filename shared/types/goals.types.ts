import { GoalCategoryEnum, GoalStatusEnum } from "../enums/goals.enums";

export type GoalStatus = GoalStatusEnum;
export type GoalCategory = GoalCategoryEnum;

// INPUTS
export interface CreateGoalRequest {
  name: string;
  endDate: Date;
  startDate: Date;
  currency: string;
  description: string;
  targetAmount: number;
  category: GoalCategory;
  monthlyContribution: number;
}

// OUTPUTS
export interface Goal {
  id: string;
  name: string;
  endDate: Date;
  userId: string;
  startDate: Date;
  updatedAt: Date;
  createdAt: Date;
  currency: string;
  status: GoalStatus;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: GoalCategory;
  monthlyContribution: number;
}
