import { Component } from '@angular/core';
import { NotificationBell, SettingsIcon } from "@components/ui/atoms/icons";

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [NotificationBell, SettingsIcon],
})
export class AppHeader {}
