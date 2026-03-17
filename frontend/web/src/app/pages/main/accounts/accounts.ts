import { Component, computed, inject } from '@angular/core';
import { AccountsService } from '@api/accounts.service';

@Component({
  selector: 'accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
})
export class Accounts {
  protected readonly accountsService = inject(AccountsService);

  protected readonly accountsWithCount = computed(() => {
    const result = this.accountsService.getUserWallets();
    return result.value()?.data;
  });
}
