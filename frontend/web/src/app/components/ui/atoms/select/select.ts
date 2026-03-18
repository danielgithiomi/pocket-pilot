import { NgClass } from '@angular/common';
import { SelectOption, SelectSize } from './select.types';
import { Component, input, computed } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'atom-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
  imports: [LucideAngularModule, FormField, NgClass],
})
export class Select {
  /* INPUTS */
  id = input.required<string>();
  label = input.required<string>();
  inverted = input<boolean>(false);
  placeholder = input.required<string>();
  size = input<SelectSize>('md');

  options = input.required<SelectOption[]>();
  formField = input.required<FieldTree<string, string>>();

  /* ICONS */
  readonly ChevronDown = ChevronDown;
  readonly iconSize = 18;

  /* COMPUTED */
  selectId = computed<string>(() => `select-field-${this.id()}`);

  fieldState = computed(() => this.formField()());

  sizeClasses = computed<string>(() => {
    switch (this.size()) {
      case 'sm':
        return 'select-sm';
      case 'lg':
        return 'select-lg';
      default:
        return 'select-md';
    }
  });
}
