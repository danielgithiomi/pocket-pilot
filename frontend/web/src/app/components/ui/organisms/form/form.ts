import { NgClass } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services';
import { Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'organism-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
  imports: [LucideAngularModule, NgClass],
})
export class Form {
  // ICONS
  protected readonly X = X;
  protected readonly iconSize = 18;

  // INPUTS
  id = input.required<string>();
  title = input.required<string>();
  showCloseIcon = input<boolean>(true);
  description = input.required<string>();

  // OUTPUTS
  protected readonly closeForm = output<FormCloseEvent>();

  // SERVICES
  protected readonly drawerService: DrawerService = inject(DrawerService);
}

export type FormCloseEvent = 'icon' | 'overlay';
