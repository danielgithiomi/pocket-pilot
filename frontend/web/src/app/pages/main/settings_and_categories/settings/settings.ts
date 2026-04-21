import { Button } from '@atoms/button';
import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsForm } from './settings-form/settings-form';

@Component({
  selector: 'settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
  imports: [LucideAngularModule, SettingsForm, Button],
})
export class Settings {
  // SIGNALS
  protected readonly isSubmittingSettingsForm = signal<boolean>(false);
}
