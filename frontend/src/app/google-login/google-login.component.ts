import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {

  cookieValue: any

  constructor( private cookieService:CookieService, private route:Router ) { }

  ngOnInit(): void {

    this.cookieValue = this.cookieService.get('token');
    localStorage.setItem ('usertoken', this.cookieValue);
    this.route.navigateByUrl('layout/homepage');
  }

}
