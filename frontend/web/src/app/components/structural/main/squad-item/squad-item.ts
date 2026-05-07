import { SplitwiseSquad } from '@global/types';
import { Component, computed, input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, EllipsisVertical } from 'lucide-angular';

@Component({
  selector: 'squad-item',
  styleUrl: './squad-item.css',
  templateUrl: './squad-item.html',
  imports: [NgOptimizedImage, NgClass, LucideAngularModule],
})
export class SquadItem {

    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly options = EllipsisVertical;

  // INPUTS
  readonly squad = input.required<SplitwiseSquad>();

  // COMPUTED
  protected readonly squadId = computed<string>(() => this.squad().id);
  protected readonly squadInitial = computed<string>(() => {
    const { squadName } = this.squad();
    return squadName.charAt(0).toUpperCase();
  });
  protected readonly squadImage = computed<string>(
    () => this.squad().squadImageKey ?? this.squadInitial(),
  );
}
