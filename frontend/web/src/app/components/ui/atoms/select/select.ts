import { NgClass } from '@angular/common';
import { SelectOption, SelectSize } from './select.types';
import { Component, input, computed } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';
import { capitalize } from '@libs/utils';

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
  inverted = input<boolean>(false);
  placeholder = input.required<string>();

  options = input.required<SelectOption[]>();
  formField = input.required<FieldTree<string, string>>();

  /* ICONS */
  readonly iconSize = 18;
  readonly ChevronDown = ChevronDown;

  /* COMPUTED */
  fieldState = computed(() => this.formField()());
  selectId = computed<string>(() => `select-field-${this.id()}`);
  formattedOptions = computed(() => {
    const options = this.options();
    if (!options) return [];
    return options.map((option) => ({
      ...option,
      label: capitalize(option.label),
    }));
  });
}
