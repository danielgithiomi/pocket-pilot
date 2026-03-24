import { formatCurrency } from '@libs/utils';
import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage } from '@angular/common';
import { AccountsService } from '@api/accounts.service';
import { ToastService } from '@components/ui/atoms/toast';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AccountType, IVoidResourceResponse, IStandardResponse } from '@global/types';
import {
  Nfc,
  Trash,
  EllipsisVertical,
  LucideAngularModule,
  FingerprintPattern,
} from 'lucide-angular';

@Component({
  selector: 'account-card',
  styleUrl: './account.css',
  templateUrl: './account.html',
  imports: [NgOptimizedImage, LucideAngularModule],
})
export class Account {
  // Inputs
  id = input.required<string>();
  name = input.required<string>();
  balance = input.required<number>();
  type = input.required<AccountType>();
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
  private readonly accountsService = inject(AccountsService);

  // Data
  protected readonly currency = this.accountsService.getDefaultCurrency();

  // Computed signals
  protected accountId = computed(() => `account-${this.id()}`);
  protected formattedBalance = computed(() => formatCurrency(this.balance(), this.currency));

  // Methods
  toggleOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  deleteAccount() {
    this.isDeleting.set(true);

    setTimeout(() => {
      this.accountsService.deleteAccountById(this.id()).subscribe({
        next: (response: IStandardResponse<IVoidResourceResponse>) => {
          this.toastService.show({
            variant: 'success',
            title: 'Account deleted successfully',
            details: response.data.details,
          });
        },
        complete: () => {
          this.onAccountDelete.emit();
          this.isDeleting.set(false);
        },
      });
    }, 2000);
  }
}
