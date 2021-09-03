import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {CustomIcons} from "./interface/custom-icons";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'LootTable';

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router,
                private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer) {
        const icons: CustomIcons [] = [
            { name: 'statistiqueAugmentation', localisation: '/assets/fond/health-increase.svg' },
            { name: 'statistiqueDiminution', localisation: '/assets/fond/health-decrease.svg' },
            { name: 'minus', localisation: '/assets/fond/pounceTest.svg' },
            { name: 'upgrade', localisation: '/assets/fond/upgrade.svg' },
            { name: 'skills', localisation: '/assets/fond/skills.svg' }
        ]
        for (const icon of icons) {
            this.matIconRegistry.addSvgIcon(
                icon.name,
                this.domSanitizer.bypassSecurityTrustResourceUrl(environment.deployUrl + icon.localisation)
            );
        }
    }

    ngOnInit(): void {
        // console.log(localStorage);
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(async event => {
            const url = JSON.parse(JSON.stringify(event)).url;
            await this.authService.checkUserInLocalStorage(this.http, this.router, url);
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
