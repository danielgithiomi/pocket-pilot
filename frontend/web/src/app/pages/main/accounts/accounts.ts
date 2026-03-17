import { form } from '@angular/forms/signals';
import { Input } from "@components/ui/atoms/input";
import { Button } from '@components/ui/atoms/button';
import { AccountsService } from '@api/accounts.service';
import { Form } from '@components/structural/main/form/form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import {
  AccountsSchema,
  initialAccountsFormState,
  accountsFormValidationSchema,
} from './accounts.types';

@Component({
  selector: 'accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  imports: [NoData, Button, LucideAngularModule, Form, Input],
})
export class Accounts {
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;
  protected readonly accountsService = inject(AccountsService);

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  protected readonly accountsWithCount = computed(() => {
    const result = this.accountsService.getUserWallets();
    return result.value()?.data;
  });

  // Form
  protected accountsFormModel = signal<AccountsSchema>(initialAccountsFormState);
  protected accountsForm = form(this.accountsFormModel, accountsFormValidationSchema);
  
  submitAccountsForm = (event: Event) => {
    event.preventDefault();
    
    const { name } = this.accountsFormModel();
    
    console.log(name);
    
    this.isSubmitting.set(true);
    
    // TODO: Call API to create account
    
    this.isSubmitting.set(false);
  };
}
