import { Component, computed, input } from '@angular/core';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'dashboard-card',
  imports: [LucideAngularModule],
  styleUrl: './dashboard-card.css',
  templateUrl: './dashboard-card.html',
})
export class DashboardCard {
  iconSize = input<number>(16);
  id = input.required<string>();
  title = input.required<string>();
  value = input.required<string>();
  subtitle = input.required<string>();
  isLoading = input.required<boolean>();
  icon = input.required<LucideIconData>();

  // Computed
  protected cardId = computed(() => `${this.id()}-dashboard-card`);
}
