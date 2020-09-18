import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'lootTableAngular';

    constructor(private authService: AuthService) {
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
