import { Component, computed, inject } from '@angular/core';
import { AccountsService } from '@api/accounts.service';
import { NoData } from "@components/structural/main/no-data/no-data";

@Component({
  selector: 'accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  imports: [NoData],
})
export class Accounts {
  protected readonly accountsService = inject(AccountsService);

  protected readonly accountsWithCount = computed(() => {
    const result = this.accountsService.getUserWallets();
    return result.value()?.data;
  });
}
