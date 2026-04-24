import { Account } from '@widgets/account';
import { Account as IAccount } from '@global/types';
import { capitalize, formatCurrency, formatDate } from '@libs/utils';
import { Component, computed, inject, input } from '@angular/core';
import { AccountsService } from '@api/accounts.service';

@Component({
  selector: 'account-details',
  templateUrl: './details.html',
  imports: [Account],
})
export class DetailsComponent {
  // INPUTS
  readonly account = input.required<IAccount>();

  // SERVICES
  private readonly accountService = inject(AccountsService);

  // DATA
  protected readonly currency = this.accountService.getDefaultCurrency();

  // METHODS
  protected formatText(text: string) {
    return capitalize(text);
  }

  protected formatDate(date: string) {
    return formatDate(date);
  }

  protected formatBalance(balance: number) {
    return formatCurrency(balance, this.currency, 2, true, false);
  }
}
