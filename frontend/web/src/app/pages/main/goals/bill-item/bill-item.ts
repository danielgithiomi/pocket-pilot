import { Bill } from '@global/types';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Sailboat } from 'lucide-angular';

@Component({
  selector: 'bill-item',
  styleUrl: './bill-item.css',
  imports: [LucideAngularModule],
  templateUrl: './bill-item.html',
})
export class BillItem {
  // Icons
  protected readonly iconSize = 20;
  protected readonly sailboat = Sailboat;

  // Inputs
  billItem = input.required<Bill>();

  // Computed
  billItemId = computed(() => `bill-item-${this.billItem().id}`);
}
