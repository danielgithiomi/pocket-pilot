import { Account } from '@widgets/account';
import { ToastService } from '@atoms/toast';
import { Account as IAccount } from '@global/types';
import { Button } from '@components/ui/atoms/button';
import { AccountsService } from '@api/accounts.service';
import { Component, inject, input, output, signal } from '@angular/core';
import { denormalizeCategoryName, formatCurrency, formatDate } from '@libs/utils';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'account-details',
  templateUrl: './details.html',
  imports: [Account, Button],
})
export class DetailsComponent {
  // INPUTS
  readonly account = input.required<IAccount>();
  readonly deleteClickCount = input.required<1 | 2>();
  readonly transactionCount = input.required<number>();
  readonly isDeletingAccount = input.required<boolean>();

  // OUTPUTS
  readonly onDeleteAccountClick = output<string>();

  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly accountService = inject(AccountsService);

  // DATA
  protected readonly currency = this.accountService.getDefaultCurrency();

  // METHODS
  protected formatText(text: string) {
    return denormalizeCategoryName(text);
  }

  protected formatDate(date: string) {
    return formatDate(date);
  }

  protected formatBalance(balance: number) {
    return formatCurrency(balance, this.currency, 2, true, false);
  }
}
