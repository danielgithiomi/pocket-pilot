import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileDetail } from './profile-detail';
import { DrawerService } from '@infrastructure/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass],
})
export class Profile {

  protected readonly drawerService: DrawerService = inject(DrawerService);

}
