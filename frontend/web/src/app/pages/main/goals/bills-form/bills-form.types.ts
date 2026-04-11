import { BillType } from "@global/types";
import { BillTypeEnum } from "@global/enums";
import { required, schema } from "@angular/forms/signals";

// FORM
export interface NewBillSchema {
    name: string;
    type: string;
    dueDate: Date;
    amount: number | null;
}

export const INITIAL_FORM_STATE: NewBillSchema = {
    name: '',
    amount: null,
    dueDate: new Date(),
    type: BillTypeEnum.MONTHLY,
};

export const NewBillFormValidationSchema = schema<NewBillSchema>((root) => {
  // Name
  required(root.name, { message: 'The bill name is required field!' });

  // Type
  required(root.type, { message: 'The bill type is required field!' });

  // Due Date
  required(root.dueDate, { message: 'The bill due date is required field!' });

  // Amount
  required(root.amount, { message: 'The bill amount is required field!' });
});