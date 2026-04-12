import { Component, input, output } from '@angular/core';
import { UserSummary } from './user-summary/user-summary';
import { LucideAngularModule, Menu, Settings2, Bell } from 'lucide-angular';

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [LucideAngularModule, UserSummary],
})
export class AppHeader {
  protected readonly Menu = Menu;
  protected readonly Bell = Bell;
  protected readonly iconSize = 20;
  protected readonly Settings = Settings2;

  // Inputs
  withDrawerLayout = input<boolean>(true);

  // Outputs
  hamburgerClickEmitter = output<void>();
}
