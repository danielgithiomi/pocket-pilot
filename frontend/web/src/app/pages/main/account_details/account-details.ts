import { Button } from '@atoms/button';
import { capitalize } from '@libs/utils';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { Breadcrumbs } from '@atoms/breadcrumbs';
import { DetailsComponent } from './details/details';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { ActivatedRoute, Router } from '@angular/router';
import { NoData } from '@structural/main/no-data/no-data';
import { AccountDetailsForm } from './account-details.form';
import { TransactionsService } from '@api/transactions.service';
import { Component, computed, inject, signal } from '@angular/core';
import { TransactionsComponent } from './transactions/transactions';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { Account as IAccount, UpdateAccountBalanceVisibilityPayload } from '@global/types';
import { EyeOff, LucideAngularModule, ScanEye, SquarePen, Trash2, Wallet } from 'lucide-angular';

@Component({
    templateUrl: './account-details.html',
    imports: [
        Button,
        NoData,
        NgClass,
        FetchError,
        Breadcrumbs,
        DetailsComponent,
        AccountDetailsForm,
        LucideAngularModule,
        TransactionsComponent
    ]
})
export class AccountDetails {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly DeleteIcon = Trash2;
    protected readonly EditIcon = SquarePen;
    protected readonly BreadcrumbIcon = Wallet;
    protected readonly HideBalanceIcon = EyeOff;
    protected readonly ShowBalanceIcon = ScanEye;

    // SIGNALS
    protected readonly deleteClickCount = signal<1 | 2>(1);
    protected readonly isEditFormOpen = signal<boolean>(false);
    protected readonly isDeletingAccount = signal<boolean>(false);
    protected readonly isTogglingBalanceVisibility = signal<boolean>(false);

    // SERVICES
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastService = inject(ToastService);
    protected readonly drawerService = inject(DrawerService);
    private readonly accountsService = inject(AccountsService);
    private readonly transactionsService = inject(TransactionsService);

    // DATA
    protected readonly accountId = this.route.snapshot.paramMap.get('id');
    protected readonly accountResource = this.accountsService.getAccountWithItsTransactionsById(this.accountId!);
    protected readonly transactionsResource = this.transactionsService.getAllTransactionsRelatedToAccountId(this.accountId!);

    // COMPUTED
    protected readonly hasError = computed(() => !!this.accountResource.error() || !!this.transactionsResource.error());
    protected readonly isLoadingResources = computed(
        () => this.accountResource.isLoading() || this.transactionsResource.isLoading()
    );
    protected readonly resourceData = computed(() => {
        if (this.accountResource.error()) return undefined;

        const accountResource = this.accountResource.value()?.data;
        if (!accountResource) return undefined;

        const transactionsResource = this.transactionsResource.value()?.data;
        if (!transactionsResource) return undefined;

        const {
            count,
            data: { transactions, ...account }
        } = accountResource;
        const { data: transactionsData } = transactionsResource;
        return { count, account, transactions: transactionsData };
    });

    protected readonly breadcrumbItems = computed(() => {
        const data = this.resourceData();
        const name = data?.account?.name || 'Details';

        return [
            { label: 'Accounts', route: '/accounts' },
            {
                label: `${capitalize(name)}`,
                route: `/accounts/${this.accountId}`
            }
        ];
    });

    // METHODS
    private reloadResources = () => {
        this.accountResource.reload();
        this.transactionsResource.reload();
        this.accountsService.getUserAccounts().reload();
    };

    protected handleOnEditClick() {
        this.isEditFormOpen.set(true);
    }

    protected handleEditFormClose(cause: 'submit' | 'icon' | 'backdrop') {
        if (cause === 'submit') this.reloadResources();
        this.isEditFormOpen.set(false);
    }

    protected handleOnBalanceVisibilityToggle() {
        const data = this.resourceData();
        if (!data) return;

        const {
            account: { id: accountId, name, isBalanceVisible }
        } = data;

        this.isTogglingBalanceVisibility.set(true);

        const payload: UpdateAccountBalanceVisibilityPayload = {
            isBalanceVisible: !isBalanceVisible
        };

        this.accountsService.updateAccountBalanceVisibilityById(accountId, payload).subscribe({
            next: (account: IAccount) => {
                const {name, isBalanceVisible} = account;

                this.toastService.show({
                    variant: 'success',
                    title: 'Balance visibility toggled!',
                    details: `Your [${name}] balance has been ${isBalanceVisible ? 'made visible' : 'hidden'}.`
                });

                this.reloadResources();
            },
            complete: () => this.isTogglingBalanceVisibility.set(false)
        });
    }

    protected handleOnDeleteAccountClick(accountId: string) {
        if (!accountId || accountId === '') return;

        if (this.deleteClickCount() === 1) {
            this.deleteClickCount.set(2);
            this.toastService.show({
                variant: 'warning',
                title: 'Are you sure?',
                details: 'Deleting an account will also delete all transactions associated with it.'
            });
            return;
        }

        this.isDeletingAccount.set(true);

        setTimeout(() => {
            this.accountsService.deleteAccountById(accountId).subscribe({
                next: async () => {
                    const accountName = this.resourceData()?.account?.name ?? 'account';

                    this.toastService.show({
                        variant: 'success',
                        title: 'Account deleted!',
                        details: `Your [${accountName}] and all its transactions have been successfully deleted.`
                    });

                    this.reloadResources();
                    this.deleteClickCount.set(1);
                    await this.router.navigate(['/accounts'], { replaceUrl: true });
                },
                complete: () => this.isDeletingAccount.set(false)
            });
        }, 2000);
    }
}
