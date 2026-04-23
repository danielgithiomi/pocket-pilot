import { ActivatedRoute } from '@angular/router';
import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';

@Component({
  selector: 'account-details',
  templateUrl: './account-details.html',
  imports: [Breadcrumbs, LucideAngularModule],
})
export class AccountDetails {
  // ICONS
  protected readonly breadcrumbIcon = Wallet;

  // SERVICES
  private readonly route = inject(ActivatedRoute);

  // DATA
  protected readonly accountId = this.route.snapshot.paramMap.get('id');

  // COMPUTED
  protected readonly breadcrumbItems = computed(() => {
    return [
      { label: 'Accounts', route: '/accounts' },
      { label: 'Details', route: `/accounts/${this.accountId}` },
    ];
  });
}
