import { capitalize } from '@libs/utils';
import { NgClass } from '@angular/common';
import { Breadcrumbs } from '@atoms/breadcrumbs';
import { ActivatedRoute } from '@angular/router';
import { DetailsComponent } from './details/details';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { NoData } from '@structural/main/no-data/no-data';
import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { TransactionsComponent } from './transactions/transactions';
import { FetchError } from '@structural/main/fetch-error/fetch-error';

@Component({
  templateUrl: './account-details.html',
  imports: [
    NoData,
    NgClass,
    FetchError,
    Breadcrumbs,
    DetailsComponent,
    LucideAngularModule,
    TransactionsComponent,
  ],
})
export class AccountDetails {
  // ICONS
  protected readonly breadcrumbIcon = Wallet;

  // SERVICES
  private readonly route = inject(ActivatedRoute);
  protected readonly drawerService = inject(DrawerService);
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
