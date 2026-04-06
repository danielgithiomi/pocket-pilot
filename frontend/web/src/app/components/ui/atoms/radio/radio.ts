import { NgClass } from '@angular/common';
import { FormField, FieldTree } from '@angular/forms/signals';
import { RadioOption, SelectionMode, RadioLayout } from './radio.types';
import { Component, input, signal, computed, output } from '@angular/core';
import { Check, CircleCheck, Circle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'atom-radio',
  templateUrl: './radio.html',
  imports: [LucideAngularModule, FormField, NgClass],
})
export class Radio {
  /* INPUTS */
  id = input.required<string>();
  required = input<boolean>(true);
  label = input.required<string>();
  inverted = input<boolean>(false);
  invertLabel = input<boolean>(false);

  options = input.required<RadioOption[]>();
  selectionMode = input<SelectionMode>('single');
  layout = input<RadioLayout>('vertical');
  maxSelections = input<number | undefined>(undefined);

  formField = input.required<FieldTree<string, string>>();

  /* OUTPUTS */
  selectionChange = output<string>();

  /* ICONS */
  readonly iconSize = 18;
  readonly Check = Check;
  readonly Circle = Circle;
  readonly CheckCircle = CircleCheck;

  /* COMPUTED */
  fieldState = computed(() => this.formField()());
  inputId = computed<string>(() => `radio-select-${this.id()}`);

  isMultiple = computed(() => this.selectionMode() === 'multiple');
  canSelectMore = computed(() => {
    if (!this.isMultiple()) return true;
    const max = this.maxSelections();
    return max === undefined || true; // Simplified for single selection
  });

  isOptionSelected = (option: RadioOption) => {
    return computed(() => {
      const currentValue = this.fieldState().value();
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

    // Update the hidden input value via DOM manipulation
    const hiddenInput = document.getElementById(this.inputId()) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = option.value;
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
