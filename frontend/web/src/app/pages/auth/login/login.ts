import { Auth_Feature } from '@libs/types';
import { WarningIcon } from '@atoms/icons/Warning';
import { NgOptimizedImage } from '@angular/common';
import { APP_FEATURES } from '@constants/auth.constants';
import { Component, signal, WritableSignal } from '@angular/core';
import { AuthFeature } from '@layouts/auth/auth-feature/auth-feature';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [NgOptimizedImage, AuthFeature, WarningIcon],
})
export class Login {
  protected readonly features: Auth_Feature[] = APP_FEATURES;
  protected year: WritableSignal<number> = signal(new Date().getFullYear());
}
