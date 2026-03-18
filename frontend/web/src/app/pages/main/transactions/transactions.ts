import { form } from '@angular/forms/signals';
import { Button } from '@components/ui/atoms/button';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';
import { Form } from '@components/ui/organisms/form/form';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import {
  TransactionSchema,
  initialTransactionFormState,
  transactionFormValidationSchema,
} from './transactions.types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  imports: [Button, LucideAngularModule, NoData, Form],
})
export class Transactions {
  // Icons
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);

  // Data
  

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Form
  protected transactionFormModel = signal<TransactionSchema>(initialTransactionFormState);
  protected transactionForm = form(this.transactionFormModel, transactionFormValidationSchema);

  // Methods
  private resetTransactionForm() {
    this.transactionForm().reset();
    this.transactionFormModel.set(initialTransactionFormState);
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetTransactionForm();
    this.isFormOpen.set(false);
  }
}
