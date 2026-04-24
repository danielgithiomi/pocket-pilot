import { Account } from '@widgets/account';
import { Component, input } from '@angular/core';
import { Account as IAccount } from '@global/types';

@Component({
  selector: 'account-details',
  //   styleUrl: './details.css',
  templateUrl: './details.html',
  imports: [Account],
})
export class DetailsComponent {
  readonly account = input.required<IAccount>();
}
