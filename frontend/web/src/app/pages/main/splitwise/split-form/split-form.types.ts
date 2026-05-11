import { required, schema } from '@angular/forms/signals';

export interface SplitFormSchema {
  eventDate: Date;
  eventName: string;
  squadName: string;
  eventMembers: string[];
  billingCurrency: string;
}

export const InitialSplitFormState = {
  eventName: '',
  squadName: '',
  eventMembers: [],
  eventDate: new Date(),
};

export const SplitFormValidationSchema = schema<SplitFormSchema>((root) => {
  // Name
  required(root.eventName, { message: 'The event name is required field!' });

  // Date
  required(root.eventDate, { message: 'The event date is required field!' });

  // Squad
  required(root.squadName, { message: 'The squad name is required field!' });

  // Members
  required(root.eventMembers, { message: 'The event members are required field!' });
});
