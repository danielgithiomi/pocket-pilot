import { Button } from '@atoms/button';
import { Component, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';

@Component({
  selector: 'app-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
  imports: [Button, LucideAngularModule],
})
export class Categories {
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // States
  protected isFormOpen = signal<boolean>(false);

  // Methods
  protected handleOpenForm() {
    this.isFormOpen.set(true);
  }
}
