import { DynamicModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

export const ScheduleConfig: DynamicModule = ScheduleModule.forRoot({
    cronJobs: true,
    timeouts: true,
    intervals: true,
});
