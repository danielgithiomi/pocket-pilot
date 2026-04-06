# Radio Select Component

A reusable radio button select component for Angular applications using signal forms.

## Usage

```typescript
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms/signals';

@Component({
  selector: 'app-example',
  template: `
    <atom-radio-select
      id="gender"
      label="Gender"
      [required]="true"
      [options]="genderOptions"
      [formField]="genderControl"
      layout="vertical"
      (selectionChange)="onGenderChange($event)"
    />
  `,
  imports: [RadioSelect, ...]
})
export class ExampleComponent {
  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];
  
  genderControl = new FormControl('', Validators.required);
  
  onGenderChange(value: string) {
    console.log('Selected gender:', value);
  }
}
```

## Inputs

- `id` (required): Unique identifier for the component
- `label` (required): Label text for the radio group
- `options` (required): Array of radio options with value and label
- `formField` (required): Form field for signal forms integration
- `required`: Whether the field is required (default: true)
- `inverted`: Whether to use inverted styling (default: false)
- `invertLabel`: Whether to invert label styling (default: false)
- `selectionMode`: 'single' or 'multiple' (default: 'single')
- `layout`: 'vertical', 'horizontal', or 'grid' (default: 'vertical')
- `maxSelections`: Maximum number of selections for multiple mode

## Outputs

- `selectionChange`: Emitted when selection changes

## Types

```typescript
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectionMode = 'single' | 'multiple';
type RadioLayout = 'vertical' | 'horizontal' | 'grid';
```

## Styling

The component uses Tailwind CSS classes and can be customized through the following CSS classes:

- `.radio-select-field`: Main container
- `.radio-option`: Individual radio option
- `.radio-option.selected`: Selected state
- `.radio-option.disabled`: Disabled state
- `.radio-options-wrapper`: Options container
- `.radio-options-wrapper.layout-horizontal`: Horizontal layout
- `.radio-options-wrapper.layout-grid`: Grid layout
