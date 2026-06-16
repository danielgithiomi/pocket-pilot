import { LucideIconData } from 'lucide-angular';

export type StatusStepState = 'completed' | 'active' | 'pending';

export interface StatusStep {
    /** Unique token for the icon name (no spaces). */
    id: string;
    name: string;
    icon: LucideIconData;
    /** Optional override; otherwise derived from `activeIndex`. */
    state?: StatusStepState;
}
