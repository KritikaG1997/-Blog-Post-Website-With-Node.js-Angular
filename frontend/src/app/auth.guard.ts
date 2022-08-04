import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _route: Router,
    private _authservice: ServiceService) { }

  canActivate(): boolean {
    if (this._authservice.loggedIn()) {
      return true
    }
    else {
      this._route.navigateByUrl('/login');
      return false
    }
  }

}
