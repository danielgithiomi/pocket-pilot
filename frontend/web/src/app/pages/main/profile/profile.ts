import { Component } from '@angular/core';
import { ProfileDetail } from "./profile-detail";

@Component({
  selector: 'app-profile',
  imports: [ProfileDetail],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
