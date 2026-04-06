import { NgClass } from '@angular/common';
import { FieldTree } from '@angular/forms/signals';
import { Component, input, computed, output } from '@angular/core';
import { RadioOption, SelectionMode, RadioLayout } from './radio.types';
import { Check, CircleCheckBig, Circle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'atom-radio',
  styleUrl: './radio.css',
  templateUrl: './radio.html',
  imports: [LucideAngularModule, NgClass],
})
export class Radio {
  /* INPUTS */
  id = input.required<string>();
  required = input<boolean>(true);
  label = input.required<string>();
  inverted = input<boolean>(false);
  invertLabel = input<boolean>(false);
  selectedValue = input<string | null | number>(null);

  layout = input<RadioLayout>('vertical');
  options = input.required<RadioOption[]>();
  selectionMode = input<SelectionMode>('single');
  maxSelections = input<number | undefined>(undefined);

  formField = input.required<FieldTree<string | null | number, string>>();

  /* OUTPUTS */
  selectionChange = output<string>();

  /* ICONS */
  readonly iconSize = 18;
  readonly Check = Check;
  readonly Circle = Circle;
  readonly CheckCircle = CircleCheckBig;

  /* COMPUTED */
  fieldState = computed(() => this.formField()());
  inputId = computed<string>(() => `radio-${this.id()}`);

  isMultiple = computed(() => this.selectionMode() === 'multiple');
  canSelectMore = computed(() => {
    if (!this.isMultiple()) return true;
    const max = this.maxSelections();
    return max === undefined || true; // Simplified for single selection
  });

  isOptionSelected = (option: RadioOption) => {
    return computed(() => {
      const currentValue = this.selectedValue() ?? this.fieldState().value();
      return currentValue === option.value;
    });
  };

  isOptionDisabled = (option: RadioOption) => {
    return computed(() => {
      return option.disabled;
    });
  };

  /* METHODS */
  onOptionClick(option: RadioOption) {
    if (this.isOptionDisabled(option)()) return;
    this.selectionChange.emit(option.value);
  }
}
