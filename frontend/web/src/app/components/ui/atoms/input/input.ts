import { NgClass } from '@angular/common';
import { AutoComplete, InputType } from './input.types';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Eye, EyeOff, LucideAngularModule, X } from 'lucide-angular';
import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'atom-input',
  templateUrl: './input.html',
  imports: [LucideAngularModule, FormField, NgClass],
})
export class Input {
  /* INPUTS */
  id = input.required<string>();
  numberStep = input<number>(1);
  required = input<boolean>(true);
  label = input.required<string>();
  allowEndIcon = input<boolean>(true);

  // Inversions
  inverted = input<boolean>(false);
  invertLabel = input<boolean>(false);
  invertedIcon = input<boolean>(false);

  inputClassName = input<string>('');
  wrapperClassName = input<string>('');

  type = input<InputType>('text');
  placeholder = input.required<string>();
  autocomplete = input.required<AutoComplete>();

  formField = input.required<FieldTree<string | number | null, string | number>>();

  /* OUTPUTS */
  clearOutput = output<void>();

  /* ICONS */
  readonly X = X;
  readonly Eye = Eye;
  readonly iconSize = 18;
  readonly EyeOff = EyeOff;

  /* SIGNALS */
  protected isPasswordVisible = signal(false);

  /* COMPUTED */
  fieldState = computed(() => this.formField()());
  inputId = computed<string>(() => `input-field-${this.id()}`);
  inputType = computed<InputType>(() => {
    if (this.type() !== 'password') return this.type();
    return this.isPasswordVisible() ? 'text' : 'password';
  });

  /* METHODS */
  togglePasswordVisibility() {
    this.isPasswordVisible.update((curr) => !curr);
  }
}
