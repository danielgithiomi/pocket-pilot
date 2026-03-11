import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Menu} from 'lucide-angular';
import { NotificationBell, SettingsIcon } from '@components/ui/atoms/icons';

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [NotificationBell, SettingsIcon, LucideAngularModule],
})
export class AppHeader {
  protected readonly Menu = Menu;
  hamburgerClickEmitter = output<void>();
}
