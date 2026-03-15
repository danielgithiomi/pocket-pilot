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
import { NgClass } from '@angular/common';

type DetailVariant = 'name' | 'email' | 'phone' | 'role' | 'status' | 'last-login';

@Component({
  imports: [LucideAngularModule, NgClass],
  selector: 'profile-detail',
  styleUrl: './profile-detail.css',
  template: ` <div
    id="profile-detail"
    class="profile-detail"
    [ngClass]="{ 'border-b border-primary': !isLast() }"
  >
    <div class="icon">
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
      <p class="value">{{ detailValue() }}</p>
    </div>
  </div>`,
})
export class ProfileDetail {
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
