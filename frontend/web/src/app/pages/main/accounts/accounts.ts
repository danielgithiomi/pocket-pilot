import { Button } from "@components/ui/atoms/button";
import { AccountsService } from '@api/accounts.service';
import { Form } from "@components/structural/main/form/form";
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';

@Component({
  selector: 'accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  imports: [NoData, Button, LucideAngularModule, Form],
})
export class Accounts {
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;
  protected readonly accountsService = inject(AccountsService);

  protected isFormOpen = signal<boolean>(false);
  protected readonly accountsWithCount = computed(() => {
    const result = this.accountsService.getUserWallets();
    return result.value()?.data;
  });
}
