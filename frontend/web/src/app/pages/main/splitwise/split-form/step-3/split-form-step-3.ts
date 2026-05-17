import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { formatCurrency } from '@libs/utils';
import { AuthService } from '@api/auth.service';
import { FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { SplitFormSchema } from '../split-form.types';
import { SelectOption } from '@atoms/select/select.types';
import { Component, computed, inject, input } from '@angular/core';
import { ISquadMember } from '@structural/main/squad-member/squad-member';
import { PAYMENT_OPTIONS, PAYMENT_OPTIONS_MAP } from './split-form-step-3.types';

@Component({
  selector: 'split-form-step-3',
  templateUrl: './split-form-step-3.html',
  imports: [LucideAngularModule, Input, Select],
})
export class SplitFormStep3 {
  // INPUTS
  readonly iconSize = input.required<number>();
  readonly presentMembers = input.required<string[]>();
  readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

  // SERVICES
  private readonly authService = inject(AuthService);

  // COMPUTED
  protected readonly formattedBillSubtotal = computed(() => {
    const splittables = this.formModel().splittables().value();
    const currency = this.formModel().billingCurrency().value();
    const subtotal = splittables.reduce((acc, splittable) => acc + splittable.total, 0);

    return formatCurrency(subtotal, currency, 2, true);
  });
  protected readonly billPaymentStrategyOptions = computed<SelectOption[]>(() => {
    return PAYMENT_OPTIONS.map((option) => ({
      value: option,
      label: PAYMENT_OPTIONS_MAP[option],
    }));
  });
  protected readonly billPayerOptions = computed<ISquadMember[]>(() => {
    const firstName = this.authService.user()?.name.split(' ')[0];
    const allMembers = [`${firstName}(Self)`, ...this.presentMembers()];

    return allMembers.map((member) => ({
      isChecked: false,
      memberName: member,
    }));
  });
}
