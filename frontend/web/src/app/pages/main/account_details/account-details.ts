import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'account-details',
  templateUrl: './account-details.html',
})
export class AccountDetails {
    private readonly route = inject(ActivatedRoute);

    protected readonly accountId = this.route.snapshot.paramMap.get('id');
}
