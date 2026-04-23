import { capitalize } from '@libs/utils';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';

@Component({
  selector: 'account-details',
  templateUrl: './account-details.html',
  imports: [Breadcrumbs, LucideAngularModule],
})
export class AccountDetails {
  // ICONS
  protected readonly breadcrumbIcon = Wallet;

  // SERVICES
  private readonly route = inject(ActivatedRoute);
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly accountId = this.route.snapshot.paramMap.get('id');
  protected readonly accountWithTransactions = this.accountsService.getAccountWithTransactionsById(
    this.accountId!,
  );

  // COMPUTED
  protected readonly isLoadingResources = computed(() => {
    return this.accountWithTransactions.isLoading();
  });

  protected readonly breadcrumbItems = computed(() => {
    const account = this.accountWithTransactions.value()?.data;

    const name = account?.name || 'Details';

    return [
      { label: 'Accounts', route: '/accounts' },
      {
        label: `${capitalize(name)}`,
        route: `/accounts/${this.accountId}`,
      },
    ];
  });
}
