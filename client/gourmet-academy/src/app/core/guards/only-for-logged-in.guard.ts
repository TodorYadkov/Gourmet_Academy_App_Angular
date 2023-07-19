import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, } from '@angular/router';
import { ManagerSessionService } from '../services/users/manager-session.service';

@Injectable({ providedIn: 'root' })
export class onlyForLoggedInGuard implements CanActivate {
  constructor(
    private router: Router,
    private managerSession: ManagerSessionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    if (this.managerSession.hasUser) {

      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}