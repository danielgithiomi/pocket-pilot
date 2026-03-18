import { NgClass } from "@angular/common";
import { LucideAngularModule, X } from "lucide-angular";
import { DrawerService } from "@infrastructure/services";
import { Component, computed, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
  imports: [LucideAngularModule, NgClass],
})
export class Form {
  // Icons
  protected readonly iconSize = 18;
  protected readonly X = X;

  // Services
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // Outputs
  protected readonly closeForm = output<void>();

  // Inputs
  id = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
