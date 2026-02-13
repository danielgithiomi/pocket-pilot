import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthHeader} from '@layouts/headers/auth-header/auth-header';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, AuthHeader],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

}
