import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoalsService } from '@api/goals.service';
import { Button } from "@components/ui/atoms/button";
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-goals',
  imports: [NgClass, Button, LucideAngularModule],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class Goals {
  // [ngClass]="{ 'grid place-items-center': count === 0 || transactions.error() }"

  // Icons 
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;

  // Services
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);

  // Data
  protected readonly goalCategories = this.goalsService.getGoalCategories;
  
}
