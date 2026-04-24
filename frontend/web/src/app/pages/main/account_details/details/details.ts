import { Account } from '@widgets/account';
import { Account as IAccount } from '@global/types';
import { Button } from '@components/ui/atoms/button';
import { AccountsService } from '@api/accounts.service';
import { Component, inject, input, output } from '@angular/core';
import { formatToReadable, formatCurrency, formatDate } from '@libs/utils';

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
  private readonly accountService = inject(AccountsService);

  // DATA
  protected readonly currency = this.accountService.getDefaultCurrency();

  // METHODS
  protected formatText(text: string) {
    return formatToReadable(text);
  }

  protected formatDate(date: string) {
    return formatDate(date);
  }

  protected formatBalance(balance: number) {
    return formatCurrency(balance, this.currency, 2, true, false);
  }
}
