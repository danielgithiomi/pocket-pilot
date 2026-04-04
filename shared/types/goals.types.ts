import { GoalCategoryEnum, GoalStatusEnum } from '../enums/goals.enums';

export type GoalStatus = GoalStatusEnum;
export type GoalCategory = GoalCategoryEnum;

// INPUTS
export interface CreateGoalRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: GoalCategory;
  status: GoalStatus;
  monthlyContribution: number;
  targetAmount: number;
}

// OUTPUTS
export interface Goal {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: GoalCategory;
  status: GoalStatus;
  monthlyContribution: number;
  targetAmount: number;
  currentAmount: number;
  updatedAt: Date;
  createdAt: Date;
};