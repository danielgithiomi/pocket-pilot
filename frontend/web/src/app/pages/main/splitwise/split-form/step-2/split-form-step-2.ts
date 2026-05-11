import { Component, signal } from '@angular/core';

@Component({
  selector: 'split-form-step-2',
  templateUrl: './split-form-step-2.html',
})
export class SplitFormStep2 {
    
  // INTERNAL STATE
  protected readonly isSubmittingEventItems = signal<boolean>(false);
}
