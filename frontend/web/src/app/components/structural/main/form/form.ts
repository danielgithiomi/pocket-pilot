import { NgClass } from "@angular/common";
import { LucideAngularModule, X } from "lucide-angular";
import { Component, inject, input, output } from '@angular/core';
import { DrawerService } from "@infrastructure/services";

@Component({
  selector: 'app-form',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './form.html',
  styleUrl: './form.css',
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
