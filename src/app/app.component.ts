import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'LootTable';

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router) {
    }

    ngOnInit(): void {
        // console.log(localStorage);
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            const url = JSON.parse(JSON.stringify(event)).url;
            this.authService.checkUserInLocalStorage(this.http, this.router, url);
        });
    }

    isAdmin() {
        return this.authService.isAdmin();
    }

    isGameMaster() {
        return this.authService.isGameMaster();
    }

    isAuth() {
        return this.authService.isAuthenticated();
    }
}
