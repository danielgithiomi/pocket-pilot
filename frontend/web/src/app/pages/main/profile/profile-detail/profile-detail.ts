import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  User,
  Phone,
  AtSign,
  Activity,
  CalendarClock,
  LucideIconData,
  ShieldEllipsis,
  LucideAngularModule,
} from 'lucide-angular';

type DetailVariant = 'name' | 'email' | 'phone' | 'role' | 'status' | 'last-login';

@Component({
  imports: [LucideAngularModule, NgClass],
  selector: 'profile-detail',
  styleUrl: './profile-detail.css',
  template: ` <div
    id="profile-detail"
    class="profile-detail"
    [ngClass]="{ 'border-b border-muted-text': !isLast() }"
  >
    <div class="icon shrink-0">
      <lucide-icon
        [size]="18"
        [strokeWidth]="2.5"
        [img]="detailIcon()"
        color="var(--primary)"
        [name]="detailVariant()"
      ></lucide-icon>
    </div>

    <div class="info">
      <p class="title">{{ detailTitle() }}</p>
      @if (isLoading()) {
        <div
          class="skeleton h-5"
          [ngClass]="{
            'w-1/2':
              detailVariant() === 'name' ||
              detailVariant() === 'email' ||
              detailVariant() === 'last-login',
            'w-1/3': detailVariant() === 'phone',
            'w-1/6': detailVariant() === 'role',
            'w-1/5': detailVariant() === 'status',
          }"
        ></div>
      } @else {
        @switch (detailVariant()) {
          @case ('status') {
            <div class="bg-primary/50 py-0.5 px-3 rounded-full w-fit!">
              <p class="value truncate-text uppercase">{{ detailValue() }}</p>
            </div>
          }
          @case ('role') {
            <div class="bg-muted-text/50 py-0.5 px-3 rounded-full w-fit!">
              <p class="value truncate-text">{{ detailValue() }}</p>
            </div>
          }
          @default {
            <p class="value truncate-text">{{ detailValue() }}</p>
          }
        }
      }
    </div>
  </div>`,
})
export class ProfileDetail {
  isLoading = input(true);
  isLast = input<boolean>(false);
  detailValue = input.required();
  detailVariant = input.required<DetailVariant>();

  protected detailTitle = computed<string>(() => {
    switch (this.detailVariant()) {
      case 'name':
        return 'Full Name';
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      case 'role':
        return 'Role';
      case 'status':
        return 'Account Status';
      case 'last-login':
        return 'Last Login';
    }
  });

  protected detailIcon = computed<LucideIconData>(() => {
    switch (this.detailVariant()) {
      case 'name':
        return User;
      case 'email':
        return AtSign;
      case 'phone':
        return Phone;
      case 'role':
        return ShieldEllipsis;
      case 'status':
        return Activity;
      case 'last-login':
        return CalendarClock;
    }
  });
}
