import { capitalize } from '@libs/utils';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { Breadcrumbs } from '@atoms/breadcrumbs';
import { DetailsComponent } from './details/details';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { ActivatedRoute, Router } from '@angular/router';
import { NoData } from '@structural/main/no-data/no-data';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { Component, computed, inject, signal } from '@angular/core';
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

  // SIGNALS
  protected readonly deleteClickCount = signal<1 | 2>(1);
  protected readonly isDeletingAccount = signal<boolean>(false);

  // SERVICES
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
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

  // METHODS

  private reloadResources = () => this.accountsService.getUserAccounts().reload();

  protected handleDeleteAccount(accountId: string) {
    if (this.deleteClickCount() === 1) {
      this.deleteClickCount.set(2);
      this.toastService.show({
        variant: 'warning',
        title: 'Are you sure?',
        details: 'Deleting an account will remove all transactions associated with it.',
      });
      return;
    }

    this.isDeletingAccount.set(true);

    setTimeout(() => {
      this.accountsService.deleteAccountById(accountId).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Account deleted!',
            details: 'The account and all its transactions have been successfully deleted.',
          });

          this.reloadResources();
          this.deleteClickCount.set(1);
          this.router.navigate(['/accounts'], { replaceUrl: true });
        },
        complete: () => this.isDeletingAccount.set(false),
      });
    }, 2000);
  }
}
