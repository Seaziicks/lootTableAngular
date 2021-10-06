import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private http: HttpClient,
                private authService: AuthService,
                private router: Router) {
    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const url: string = state.url;
        if (!this.authService.isAuth && localStorage.getItem('userSession')) {
            await this.authService.checkUserInLocalStorageAsPromise(this.http);
        }
        return this.checkLogin(url);
    }

    checkLogin(url: string): true | UrlTree {
        if (this.authService.isGameMaster()) {
            return true;
        } else if (!this.authService.isAuth) {
            return this.router.parseUrl('/login');
        } else {
            // Store the attempted URL for redirecting
            this.authService.redirectUrl = url;

            // Redirect to the login page
            return this.router.parseUrl('/unauthorized');
        }
    }

}
