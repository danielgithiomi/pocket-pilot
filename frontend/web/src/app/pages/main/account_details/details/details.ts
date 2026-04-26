import { Account } from '@widgets/account';
import { SummaryItem } from './summary-item';
import { Account as IAccount } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, input } from '@angular/core';
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
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly defaultCurrency = this.accountsService.getDefaultCurrency();

  // COMPUTED
  protected readonly isDifferentCurrency = computed<boolean>(() => {
    return this.account().currency !== this.defaultCurrency;
  });

  // METHODS
  protected formatText(text: string) {
    return formatToReadable(text);
  }

  protected formatDate(date: string) {
    return formatDate(date);
  }

  protected formatBalance() {
    return formatCurrency(this.account().balance, this.account().currency, 2, true, false);
  }

  protected formatConversion() {
    return formatCurrency(this.account().balance * 45, this.defaultCurrency, 2, true, false);
  }
}
