import {Component, computed, forwardRef, inject, Input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

@Component({
  selector: 'atom-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1">
      <label [for]="id" class="text-sm font-medium">
        {{ label }}
      </label>

      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="border rounded px-3 py-2 outline-none"
        [class.border-red-500]="invalid()"
      />

<!--      <atom-error-->
<!--        [errors]="control?.errors"-->
<!--        [touched]="control?.touched ?? false"-->
<!--        [dirty]="control?.dirty ?? false"-->
<!--      />-->
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {

  @Input({ required: true}) id: string = "";
  @Input({ required: true }) label: string = "";
  @Input({ required: true }) type: string = "text";
  @Input({ required: true, alias: 'hint' }) placeholder: string = "";
  value = signal('');
  invalid = computed(() => {
    if (!this.control) return false;
    return this.control.invalid && (this.control.touched || this.control.dirty);
  });
  private ngControl = inject(NgControl, { optional: true });
  control = this.ngControl?.control ?? null;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  onTouched() {
    this.onTouchedFn();
  }

  private onChange = (value: string) => {};

  private onTouchedFn = () => {};
}
