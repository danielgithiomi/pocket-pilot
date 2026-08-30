import VanillaTilt from 'vanilla-tilt';
import { formatCurrency } from '@libs/utils';
import { RouterLink } from '@angular/router';
import { ImageDimensions } from '@libs/types';
import { AccountsService } from '@api/accounts.service';
import { ThemeService } from '@infrastructure/services';
import { ToastService } from '@components/ui/atoms/toast';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Account as IAccount, IVoidResourceResponse, UpdateAccountBalanceVisibilityPayload } from '@shared/types';
import { Nfc, Trash, EyeOff, ScanEye, EllipsisVertical, FingerprintPattern, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'account-card',
    styleUrl: './account.css',
    templateUrl: './account.html',
    imports: [NgOptimizedImage, LucideAngularModule, NgClass, RouterLink]
})
export class Account implements OnInit {
    // INPUTS
    id = input.required<string>();
    account = input.required<IAccount>();
    isLoading = input.required<boolean>();
    variant = input<'default' | 'detail'>('default');

    ngOnInit(): void {
        const isDetail = this.variant() === 'detail';
        if (isDetail) {
            VanillaTilt.init(document.querySelectorAll('.account-wrapper') as any, {
                max: 15,
                speed: 3000,
                reset: true,
                glare: true,
                scale: 1.025,
                reverse: true,
                'max-glare': 0.25,
                perspective: 1000
            });
        }
    }

    // OUTPUTS
    onAccountDelete = output<void>();
    onAccountBalanceVisibilityToggle = output<void>();

    // IMAGES
    protected NFC = Nfc;
    protected Trash = Trash;
    protected iconSize = 17;
    protected EyeOff = EyeOff;
    protected EyeOpen = ScanEye;
    protected Options = EllipsisVertical;
    protected IdentityIcon = FingerprintPattern;
    protected logoUrl = '/images/branding/logo.png';
    protected imageDimensions: ImageDimensions = {
        width: 30,
        height: 30
    };

    // SIGNALS
    isDeleting = signal<boolean>(false);
    isOptionsOpen = signal<boolean>(false);
    isTogglingBalanceVisibility = signal<boolean>(false);

    // SERVICES
    private readonly toastService = inject(ToastService);
    protected readonly themeService = inject(ThemeService);
    private readonly accountsService = inject(AccountsService);

    // COMPUTED
    protected accountId = computed(() => `account-${this.id()}`);
    protected formattedBalance = computed<string>(() => {
        const { balance, currency } = this.account();
        const visibleBalance = formatCurrency(balance, currency);

        const balanceLength = Math.floor(balance).toString().length;
        const hiddenBalance = '●'.repeat(balanceLength + 2);

        return this.account().isBalanceVisible ? visibleBalance : hiddenBalance;
    });

    // METHODS
    toggleOptions(event: Event) {
        event.stopPropagation();
        this.isOptionsOpen.set(!this.isOptionsOpen());
    }

    toggleBalanceVisibility(event: Event) {
        event.stopPropagation();

        this.isTogglingBalanceVisibility.set(true);

        const payload: UpdateAccountBalanceVisibilityPayload = {
            isBalanceVisible: !this.account().isBalanceVisible
        };

        this.accountsService.updateAccountBalanceVisibilityById(this.id(), payload).subscribe({
            next: (account: IAccount) => {
                const { name, isBalanceVisible } = account;

                this.toastService.show({
                    variant: 'success',
                    title: 'Balance visibility toggled!',
                    details: `Your [${name}] balance has been ${isBalanceVisible ? 'made visible' : 'hidden'}.`
                });

                this.onAccountBalanceVisibilityToggle.emit();
            },
            complete: () => this.isTogglingBalanceVisibility.set(false)
        });
    }

    deleteAccount(event: Event) {
        event.stopPropagation();
        this.isDeleting.set(true);

        setTimeout(() => {
            this.accountsService.deleteAccountById(this.id()).subscribe({
                next: (response: IVoidResourceResponse) => {
                    this.toastService.show({
                        variant: 'success',
                        details: response.details,
                        title: 'Account deleted successfully!'
                    });
                },
                complete: () => {
                    this.onAccountDelete.emit();
                    this.isDeleting.set(false);
                }
            });
        }, 2000);
    }
}
