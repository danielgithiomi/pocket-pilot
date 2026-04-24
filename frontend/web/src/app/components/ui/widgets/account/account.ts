import { formatCurrency } from '@libs/utils';
import { RouterLink } from '@angular/router';
import { ImageDimensions } from '@libs/types';
import { AccountsService } from '@api/accounts.service';
import { ThemeService } from '@infrastructure/services';
import { ToastService } from '@components/ui/atoms/toast';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AccountType, Account as IAccount, IVoidResourceResponse } from '@global/types';
import {
  Nfc,
  Trash,
  EllipsisVertical,
  FingerprintPattern,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'account-card',
  styleUrl: './account.css',
  templateUrl: './account.html',
  imports: [NgOptimizedImage, LucideAngularModule, NgClass, RouterLink],
})
export class Account {
  // Inputs
  id = input.required<string>();
  account = input.required<IAccount>();
  isLoading = input.required<boolean>();

  // Outputs
  onAccountDelete = output<void>();

  // Images
  protected NFC = Nfc;
  protected Trash = Trash;
  protected Options = EllipsisVertical;
  protected IdentityIcon = FingerprintPattern;
  protected logoUrl = '/images/branding/logo.png';
  protected imageDimensions: ImageDimensions = {
    width: 30,
    height: 30,
  };

  // Signals
  isDeleting = signal<boolean>(false);
  isOptionsOpen = signal<boolean>(false);

  // Services
  private readonly toastService = inject(ToastService);
  protected readonly themeService = inject(ThemeService);
  private readonly accountsService = inject(AccountsService);

  // Data
  protected readonly currency = this.accountsService.getDefaultCurrency();

  // Computed signals
  protected accountId = computed(() => `account-${this.id()}`);
  protected formattedBalance = computed(() =>
    formatCurrency(this.account().balance, this.currency),
  );

  // Methods
  toggleOptions(event: Event) {
    event.stopPropagation();
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  deleteAccount() {
    this.isDeleting.set(true);

    this.accountsService.deleteAccountById(this.id()).subscribe({
      next: (response: IVoidResourceResponse) => {
        this.toastService.show({
          variant: 'success',
          title: 'Account deleted successfully',
          details: response.details,
        });
      },
      complete: () => {
        this.onAccountDelete.emit();
        this.isDeleting.set(false);
      },
    });
  }
}
