import { capitalize } from '@libs/utils';
import { NgClass } from '@angular/common';
import { SelectOption, SelectSize } from './select.types';
import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'atom-select',
  templateUrl: './select.html',
  imports: [FormField, NgClass, LucideAngularModule],
})
export class Select {
  /* INPUTS */
  id = input.required<string>();
  size = input<SelectSize>('sm');
  required = input<boolean>(true);
  label = input.required<string>();
  disabled = input<boolean>(false);
  placeholder = input.required<string>();

  // Classnames
  selectClassName = input<string>('');
  wrapperClassName = input<string>('');

  // Inversions
  inverted = input<boolean>(false);
  invertLabel = input<boolean>(false);
  invertedIcon = input<boolean>(false);

  selectedValue = input<string>('');
  options = input.required<SelectOption[]>();
  formField = input.required<FieldTree<string, string>>();

  /* ICONS */
  readonly iconSize = 18;
  readonly ChevronDown = ChevronDown;

  /* COMPUTED */
  fieldState = computed(() => this.formField()());
  selectId = computed<string>(() => `select-field-${this.id()}`);
  currentValue = computed(() => this.selectedValue() || this.fieldState().value());

  formattedOptions = computed(() => {
    const options = this.options();
    if (!options) return [];
    return options.map((option) => ({
      ...option,
      label: capitalize(option.label),
    }));
  });

  /* METHODS */
  isOptionSelected(option: SelectOption): boolean {
    return this.currentValue() === option.value;
  }
}
