import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { formatToReadable } from '@libs/utils';
import { LucideAngularModule, Check } from 'lucide-angular';
import { MemberQuantifier, QuantityChangeVariant } from './member-quantifier';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'squad-member',
  imports: [LucideAngularModule, NgClass, MemberQuantifier],
  template: `
    <div
      [id]="memberId()"
      (click)="onMemberEventClick.emit(member().memberName)"
      [ngClass]="{
        'cursor-pointer!': isCheckable(),
        'bg-primary!': inverted() && isActive(),
        'bg-loader-primary! border border-primary': isActive(),
        'opacity-50 cursor-not-allowed!': !isActive() && isDisabled(),
      }"
      class="px-2 py-1 rounded-xl bg-muted-text flex flex-row items-center gap-1.5 cursor-default"
    >
      <div class="size-5 bg-body-background grid place-items-center rounded-full">
        <p class="text-[0.725rem] font-semibold">{{ initial() }}</p>
      </div>

      <p class="text-xs text-white font-semibold">{{ formattedName() }}</p>

      @if (isActive()) {
        @if (isQuantifiable()) {
          <member-quantifier
            [id]="memberId()"
            [iconSize]="iconSize"
            [inverted]="inverted()"
            [quantity]="member().quantity ?? 1"
            [isMaximumQuantityReached]="isMaximumQuantityReached()"
            (onQuantityChangeEvent)="handleOnQuantityChange($event)"
          />
        } @else {
          <lucide-icon name="member-checked-icon" [img]="UserCheck" [size]="iconSize" />
        }
      }
    </div>
  `,
})
export class SquadMember {
  // ICONS
  protected readonly iconSize = 12;
  protected readonly UserCheck = Check;

  // INPUTS
  readonly inverted = input<boolean>(false);
  readonly isCheckable = input<boolean>(true);
  readonly isDisabled = input<boolean>(false);
  readonly isQuantifiable = input<boolean>(false);
  readonly member = input.required<ISquadMember>();
  readonly isMaximumQuantityReached = input<boolean>(false);

  // OUTPUTS
  readonly onMemberEventClick = output<string>();
  readonly onMemberQuantityChange = output<SquadMemberQuantityChangeEmmision>();

  // SERVICES
  private readonly toastService = inject(ToastService);

  // COMPUTED
  protected readonly isChecked = computed<boolean>(() => this.member().isChecked);
  protected readonly memberId = computed<string>(() => `member-${this.member().memberName}`);
  protected readonly isActive = computed<boolean>(() => this.isCheckable() && this.isChecked());
  protected readonly formattedName = computed<string>(() =>
    formatToReadable(this.member().memberName),
  );
  protected readonly initial = computed<string>(() =>
    this.member().memberName.charAt(0).toUpperCase(),
  );

  // METHODS
  protected handleOnQuantityChange(event: QuantityChangeVariant): void {
    // if (this.quantity() === 1 && event === 'decrease') {
    //   this.toastService.show({
    //     variant: 'warning',
    //     title: 'Minimum quantity reached!',
    //     details: 'You cannot decrease the quantity below 1.',
    //   });
    //   return;
    // }

    this.onMemberQuantityChange.emit({
      quantityChangeVariant: event,
      memberName: this.member().memberName,
    });
  }
}

export interface ISquadMember {
  quantity?: number;
  memberName: string;
  isChecked: boolean;
}

export interface SquadMemberQuantityChangeEmmision {
  memberName: string;
  quantityChangeVariant: QuantityChangeVariant;
}
