import { NgClass } from '@angular/common';
import { Calendar1 } from 'lucide-angular';
import { Component, inject } from '@angular/core';
import { DrawerService } from '@infrastructure/services';
import { DashboardCard } from '@structural/main/dashboard-card/dashboard-card';
import { CalendarModule, ChangedEventArgs } from '@syncfusion/ej2-angular-calendars';

@Component({
    selector: 'dashboard-calendar',
    templateUrl: './dashboard-calendar.html',
    imports: [NgClass, DashboardCard, CalendarModule]
})
export class DashboardCalendar {
    // ICONS
    protected readonly calendarIcon = Calendar1;

    // DATA
    protected readonly minDate: Date = new Date(Date.now());

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // METHODS
    handleOnDateClick(event: ChangedEventArgs) {}
}
