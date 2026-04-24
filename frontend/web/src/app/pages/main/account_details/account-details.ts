import { capitalize } from '@libs/utils';
import { NgClass } from '@angular/common';
import { Account } from '@widgets/account';
import { Breadcrumbs } from '@atoms/breadcrumbs';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';

@Component({
  selector: 'account-details',
  styleUrl: './account-details.css',
  templateUrl: './account-details.html',
  imports: [Breadcrumbs, LucideAngularModule, Account, NgClass, FetchError],
})
export class AccountDetails {
  // ICONS
  protected readonly breadcrumbIcon = Wallet;

  // SERVICES
  private readonly route = inject(ActivatedRoute);
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly accountId = this.route.snapshot.paramMap.get('id');
  protected readonly accountWithTransactions =
    this.accountsService.getAccountWithItsTransactionsById(this.accountId!);

  // COMPUTED
  protected readonly hasError = computed(() => !!this.accountWithTransactions.error());
  protected readonly isLoadingResources = computed(() => this.accountWithTransactions.isLoading());
  protected readonly resourceData = computed(() => {
    const resource = this.accountWithTransactions.value()?.data;

    if (!resource) return;

    const { count, data } = resource;
    const { transactions, ...account } = data;
    return { count, account, transactions };
  });

  protected readonly breadcrumbItems = computed(() => {
    const data = this.resourceData();
    const name = data?.account?.name || 'Details';

    return [
      { label: 'Accounts', route: '/accounts' },
      {
        label: `${capitalize(name)}`,
        route: `/accounts/${this.accountId}`,
      },
    ];
  });
}
