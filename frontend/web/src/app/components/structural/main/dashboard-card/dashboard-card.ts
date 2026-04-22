import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'dashboard-card',
  styleUrl: './dashboard-card.css',
  templateUrl: './dashboard-card.html',
  imports: [LucideAngularModule, CommonModule, NgClass],
})
export class DashboardCard {
  value = input<string>();
  iconSize = input<number>(16);
  id = input.required<string>();
  title = input.required<string>();
  iconClassName = input<string>('');
  subtitle = input.required<string>();
  wrapperClassName = input<string>('');
  isLoading = input.required<boolean>();
  icon = input.required<LucideIconData>();

  // Computed
  protected cardId = computed(() => `${this.id()}-dashboard-card`);
}
