// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authService.checkIsLoggedIn()) {
      const requiredRoles = next.data['roles'] as string[];

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(this.authService.getUserRole()!);
        console.log('authenticated')
        if (!hasRequiredRole) {
          this.router.navigate(['/dashboard/view-pto']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
