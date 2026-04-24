import { Account } from '@widgets/account';
import { SummaryItem } from './summary-item';
import { Component, input } from '@angular/core';
import { Account as IAccount } from '@global/types';
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

  // METHODS
  protected formatText(text: string) {
    return formatToReadable(text);
  }

  protected formatDate(date: string) {
    return formatDate(date);
  }

  protected formatBalance(balance: number) {
    return formatCurrency(balance, this.account().currency, 2, true, false);
  }
}
