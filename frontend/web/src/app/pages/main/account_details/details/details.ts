import { Account } from '@widgets/account';
import { SummaryItem } from './summary-item';
import { Account as IAccount } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { Component, inject, input } from '@angular/core';
import { formatToReadable, formatCurrency, formatDate } from '@libs/utils';

@Component({
  selector: 'account-details',
  templateUrl: './details.html',
  imports: [Account, SummaryItem],
})
export class DetailsComponent {
  // INPUTS
  readonly account = input.required<IAccount>();
  readonly transactionCount = input.required<number>();

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
