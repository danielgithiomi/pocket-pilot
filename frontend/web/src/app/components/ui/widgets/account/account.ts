import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
  LucideAngularModule,
  Nfc,
  Infinity as InfinityIcon,
  EllipsisVertical,
  Trash,
} from 'lucide-angular';

@Component({
  selector: 'account-card',
  imports: [NgOptimizedImage, LucideAngularModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
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
    width: 40,
    height: 40,
  };

  // Signals
  isOptionsOpen = signal<boolean>(false);

  // Computed signals
  accountId = computed(() => `account-${this.id()}`);
  formattedBalance = computed(() => `${this.balance().toFixed(2)}`);

  // Methods
  toggleOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  deleteAccount() {
    console.log('Delete account', this.id());
  }
}
