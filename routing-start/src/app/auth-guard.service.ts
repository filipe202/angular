import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.isAuthenticated().then((authenticated:  boolean)  => {
      if  (authenticated) {
      return true;
      } else {
         this.router.navigate(['/']);
         return false;
        }
    });  }
  canActivate  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> |  Promise<boolean> | boolean {
    return this.authService.isAuthenticated().then((authenticated:  boolean)  => {
      if  (authenticated) {
      return true;
      } else {
         this.router.navigate(['/']);
         return false;
        }
    });
  }
constructor(private authService:  AuthService, private router:  Router) {

}

}
