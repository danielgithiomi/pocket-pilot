import { form } from '@angular/forms/signals';
import { Button } from '@components/ui/atoms/button';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';
import { Form } from '@components/ui/organisms/form/form';
import { TransactionsService } from '@api/transactions.service';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import {
  TransactionSchema,
  initialTransactionFormState,
  transactionFormValidationSchema,
} from './transactions.types';
import { Input } from "@components/ui/atoms/input";
import { Select } from "@components/ui/atoms/select";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  imports: [Button, LucideAngularModule, NoData, Form, Input, Select],
})
export class Transactions {
  // Icons
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly transactionTypes = this.transactionsService.getTransactionTypes();
  protected readonly transactionCategories = this.transactionsService.getTransactionCategories();

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

  protected submitTransactionForm(event: Event) {
    event.preventDefault();
    this.isSubmitting.set(true);
    // TODO: Implement transaction creation
    this.isSubmitting.set(false);
  }
}

