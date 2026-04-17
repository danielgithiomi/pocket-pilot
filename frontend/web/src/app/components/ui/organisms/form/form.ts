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
  protected readonly iconSize = 18;
  protected readonly X = X;

  // INPUTS
  id = input.required<string>();
  title = input.required<string>();
  showCloseIcon = input<boolean>(true);
  description = input.required<string>();

  // OUTPUTS
  protected readonly closeForm = output<'icon' | 'overlay'>();

  // SERVICES
  protected readonly drawerService: DrawerService = inject(DrawerService);
}
