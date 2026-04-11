import { Component } from "@angular/core";
import { NewBillFormValidationSchema } from "./bills-form.types";

@Component({
    selector: 'app-bills-form',
    templateUrl: './bills-form.html',
})
export class BillsFormComponent {

    // 

    // FORM
    protected readonly newBillFormModel = NewBillFormValidationSchema;
    
}