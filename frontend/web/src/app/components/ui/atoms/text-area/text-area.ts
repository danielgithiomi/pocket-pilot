import { NgClass } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Component, computed, input, output } from '@angular/core';
import { TextAreaAutoComplete, TextAreaResize } from './text-area.types';
import {
    FORM_FIELD_ERROR_BORDER_CLASSES,
    isFormFieldInError,
    resolveFormFieldVisualState,
} from '../form-field-visual-state';

@Component({
    selector: 'atom-text-area',
    templateUrl: './text-area.html',
    imports: [LucideAngularModule, FormField, NgClass],
})
export class TextArea {
    /* INPUTS */
    id = input.required<string>();
    rows = input<number>(4);
    resize = input<TextAreaResize, boolean | TextAreaResize>('vertical', {
        transform: (value) => {
            if (value === true) return 'vertical';
            if (value === false) return 'none';
            return value;
        },
    });
    required = input<boolean>(true);
    label = input.required<string>();
    disabled = input<boolean>(false);
    allowEndIcon = input<boolean>(true);

    // Inversions
    inverted = input<boolean>(false);
    invertLabel = input<boolean>(false);
    invertedIcon = input<boolean>(false);

    textAreaClassName = input<string>('');
    wrapperClassName = input<string>('');

    placeholder = input.required<string>();
    autocomplete = input<TextAreaAutoComplete>('off');

    showStatus = input<boolean>(true);
    formField = input.required<FieldTree<string, string>>();

    /* OUTPUTS */
    clearOutput = output<void>();

    /* ICONS */
    readonly X = X;
    readonly iconSize = 18;

    /* COMPUTED */
    textAreaId = computed<string>(() => `text-area-field-${this.id()}`);
    fieldState = computed(() => this.formField()());
    showFieldErrors = computed(() => isFormFieldInError(this.fieldState()));
    fieldVisualState = computed(() =>
        resolveFormFieldVisualState(this.showStatus(), this.fieldState()),
    );

    resizeClass = computed<string>(() => {
        switch (this.resize()) {
            case 'none':
                return 'resize-none';
            case 'horizontal':
                return 'resize-x';
            case 'both':
                return 'resize';
            default:
                return 'resize-y';
        }
    });

    customTextAreaClasses = computed<string>(() => {
        const classes = [this.resizeClass(), this.textAreaClassName()];

        if (this.fieldVisualState() === 'error') {
            classes.push(FORM_FIELD_ERROR_BORDER_CLASSES);
        }

        return classes.filter(Boolean).join(' ');
    });
}
