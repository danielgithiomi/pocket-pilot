import { StatusStep } from '@molecules/status';
import { FeatureStatusEnum } from '@shared/enums';
import { Clock, Code, FileCheck, Rocket, Search } from 'lucide-angular';

export const FEATURE_STATUS_STEPS: StatusStep[] = [
    { id: 'submitted', name: 'Submitted', icon: FileCheck },
    { id: 'under_review', name: 'Reviewing', icon: Search },
    { id: 'planned', name: 'Planned', icon: Clock },
    { id: 'in_progress', name: 'Implementing', icon: Code },
    { id: 'shipped', name: 'Shipped', icon: Rocket }
];

const FEATURE_STATUS_ACTIVE_INDEX: Record<FeatureStatusEnum, number> = {
    [FeatureStatusEnum.NEW]: 0,
    [FeatureStatusEnum.UNDER_REVIEW]: 1,
    [FeatureStatusEnum.REJECTED]: 1,
    [FeatureStatusEnum.PLANNED]: 2,
    [FeatureStatusEnum.IN_PROGRESS]: 3,
    [FeatureStatusEnum.SHIPPED]: FEATURE_STATUS_STEPS.length
};

export function resolveFeatureStatusActiveIndex(status: FeatureStatusEnum): number {
    return FEATURE_STATUS_ACTIVE_INDEX[status];
}

export const COMMENT_AVATAR_COLORS = [
    'feature-comment-avatar--blue',
    'feature-comment-avatar--pink',
    'feature-comment-avatar--orange',
    'feature-comment-avatar--green'
] as const;
