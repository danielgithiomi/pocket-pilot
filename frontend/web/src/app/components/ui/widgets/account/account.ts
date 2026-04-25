import VanillaTilt from 'vanilla-tilt';
import { formatCurrency } from '@libs/utils';
import { RouterLink } from '@angular/router';
import { ImageDimensions } from '@libs/types';
import { AccountsService } from '@api/accounts.service';
import { ThemeService } from '@infrastructure/services';
import { ToastService } from '@components/ui/atoms/toast';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Account as IAccount, IVoidResourceResponse } from '@global/types';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
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
        max: 10,
        speed: 500,
        reset: true,
        glare: true,
        scale: 1.005,
        reverse: true,
        'max-glare': 0.25,
        perspective: 1000,
      });
    }
  }

  // OUTPUTS
  onAccountDelete = output<void>();

  // IMAGES
  protected NFC = Nfc;
  protected Trash = Trash;
  protected Options = EllipsisVertical;
  protected IdentityIcon = FingerprintPattern;
  protected logoUrl = '/images/branding/logo.png';
  protected imageDimensions: ImageDimensions = {
    width: 30,
    height: 30,
  };

  // SIGNALS
  isDeleting = signal<boolean>(false);
  isOptionsOpen = signal<boolean>(false);

  // SERVICES
  private readonly toastService = inject(ToastService);
  protected readonly themeService = inject(ThemeService);
  private readonly accountsService = inject(AccountsService);

  // COMPUTED
  protected accountId = computed(() => `account-${this.id()}`);
  protected formattedBalance = computed(() =>
    formatCurrency(this.account().balance, this.account().currency),
  );

  // METHODS
  toggleOptions(event: Event) {
    event.stopPropagation();
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  deleteAccount(event: Event) {
    event.stopPropagation();
    this.isDeleting.set(true);

    setTimeout(() => {
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
    }, 2000);
  }
}
