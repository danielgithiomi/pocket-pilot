import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage } from '@angular/common';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, input, signal } from '@angular/core';
import {
  Nfc,
  Trash,
  EllipsisVertical,
  LucideAngularModule,
  Infinity as InfinityIcon,
} from 'lucide-angular';
import { ToastService } from '@components/ui/atoms/toast';
import { IDeletedResourceResponse, IStandardResponse } from '@global/types';

@Component({
  selector: 'account-card',
  styleUrl: './account.css',
  templateUrl: './account.html',
  imports: [NgOptimizedImage, LucideAngularModule],
})
export class Account {
  id = input.required<string>();
  name = input.required<string>();
  balance = input<number>(3000);
  currency = input<string>('MUR');

  // Images
  protected NFC = Nfc;
  protected Trash = Trash;
  protected Infinity = InfinityIcon;
  protected Options = EllipsisVertical;
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

  // Computed signals
  accountId = computed(() => `account-${this.id()}`);
  formattedBalance = computed(() => `${this.balance().toFixed(2)}`);

  // Methods
  toggleOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  deleteAccount() {
    this.isDeleting.set(true);

    setTimeout(() => {
      this.accountsService.deleteAccountById(this.id()).subscribe({
        next: (response: IStandardResponse<IDeletedResourceResponse>) => {
          this.toastService.show({
            variant: 'success',
            title: 'Account deleted successfully',
            details: response.data.details,
          });
        },
        complete: () => {
          this.isDeleting.set(false);
        },
      });
    }, 4000);
  }
}
