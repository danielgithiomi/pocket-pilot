import { NgClass } from '@angular/common';
import { FieldTree } from '@angular/forms/signals';
import { formatInputFieldDate } from '@libs/utils';
import { Calendar, LucideAngularModule, X } from 'lucide-angular';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, input, signal, computed, output } from '@angular/core';

@Component({
  selector: 'organism-date-picker',
  styleUrl: './date-picker.css',
  templateUrl: './date-picker.html',
  imports: [CalendarModule, LucideAngularModule, NgClass],
})
export class DatePicker {
  /* INPUTS */
  id = input.required<string>();
  required = input<boolean>(true);
  label = input.required<string>();
  inverted = input<boolean>(false);
  invertLabel = input<boolean>(false);
  showClearOutputIcon = input<boolean>(true);

  inputClassName = input<string>('');
  wrapperClassName = input<string>('');
  placeholder = input.required<string>();

  min = input<Date | null>(null);
  max = input<Date | null>(null);

  formField = input.required<FieldTree<string | Date, string>>();

  /* OUTPUTS */
  clearOutput = output<void>();

  /* ICONS */
  readonly X = X;
  readonly iconSize = 18;
  readonly CalendarIcon = Calendar;

  /* SIGNALS */
  protected isCalendarOpen = signal(false);

  /* COMPUTED */
  fieldState = computed(() => {
    console.log('fieldState', this.formField());
    return this.formField()();
  });
  inputId = computed<string>(() => `date-picker-${this.id()}`);

  formattedDate = computed<string>(() => {
    const value = this.fieldState().value();

    if (!value) {
      console.log('no value, returning today');
      return formatInputFieldDate(new Date().toISOString());
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      console.log(date.getTime())
      console.log('returning empty string')
      return '';
    };

    return formatInputFieldDate(date.toISOString());
  });

  selectedDateValue = computed<Date | null>(() => {
    const value = this.fieldState().value();
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    return date;
  });

  /* METHODS */
  toggleCalendar(): void {
    this.isCalendarOpen.update((curr) => !curr);
  }

  closeCalendar(): void {
    this.isCalendarOpen.set(false);
  }

  onDateSelect(event: { value?: Date }): void {
    const selectedDate = event?.value;
    if (selectedDate) {
      this.formField()().controlValue.set(selectedDate);
      this.closeCalendar();
    }
  }

  onInputClick(): void {
    this.toggleCalendar();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.clearOutput.emit();
    // this.formField()().controlValue.set('');
  }

  onCalendarClick(event: Event): void {
    event.stopPropagation();
  }
}
