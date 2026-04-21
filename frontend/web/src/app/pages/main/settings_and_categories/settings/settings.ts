import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsForm } from './settings-form/settings-form';
import { Button } from '@atoms/button';

@Component({
  selector: 'settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
  imports: [LucideAngularModule, SettingsForm, Button],
})
export class Settings {}
