import { NgClass } from '@angular/common';
import { InputType, AutoComplete } from './input.types';
import { FormField, FieldTree } from '@angular/forms/signals';
import { Component, input, signal, computed, output } from '@angular/core';
import { Eye, EyeOff, X, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'atom-input',
  styleUrl: './input.css',
  templateUrl: './input.html',
  imports: [LucideAngularModule, FormField, NgClass],
})
export class Input {
  /* INPUTS */
  id = input.required<string>();
  label = input.required<string>();
  allowEndIcon = input<boolean>(true);

  type = input<InputType>('text');
  placeholder = input.required<string>();
  autocomplete = input.required<AutoComplete>();

  formField = input.required<FieldTree<string, string>>();

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
  inputId = computed<string>(() => `input-field-${this.id()}`);

  inputType = computed<InputType>(() => {
    if (this.type() !== 'password') return this.type();
    return this.isPasswordVisible() ? 'text' : 'password';
  });

  fieldState = computed(() => this.formField()());

  /* METHODS */
  togglePasswordVisibility() {
    this.isPasswordVisible.update((curr) => !curr);
  }
}
