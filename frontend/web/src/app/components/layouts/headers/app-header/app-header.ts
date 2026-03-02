import { Component } from '@angular/core';
import { NotificationBell } from "@components/ui/atoms/icons";

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [NotificationBell],
})
export class AppHeader {}
