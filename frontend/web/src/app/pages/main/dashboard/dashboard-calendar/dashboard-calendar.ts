import { NgClass } from '@angular/common';
import { Calendar1 } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services';
import { Component, inject, output } from '@angular/core';
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

    // OUTPUTS
    onDateClickedEvent = output<ChangedEventArgs>();

    // DATA
    protected readonly minDate: Date = new Date(Date.now());

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // METHODS
    handleOnDateClick(event: ChangedEventArgs) {
        this.onDateClickedEvent.emit(event);
    }
}
