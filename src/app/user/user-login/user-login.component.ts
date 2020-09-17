import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

    hide = true;

    message: string;

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router) {
    }

    ngOnInit(): void {
        if (this.authService.isAuth) {
            this.message = null;
            // Usually you would use the redirect URL from the auth service.
            // However to keep the example simple, we will always redirect to `/admin`.
            const redirectUrl = '/GestionDropMonstreBis';

            // Redirect the user
            this.router.navigate([redirectUrl]);
        }
    }

    signIn() {
        const username = (document.getElementById('usernameUser') as HTMLInputElement).value;
        const password = (document.getElementById('passwordUser') as HTMLInputElement).value;
        console.log(username);
        console.log(password);
        this.authService.signIn(this.http, username, password).then(
            (data: any) => {
                console.log(data);
                if (this.authService.isAuth) {
                    this.message = null;
                    // Usually you would use the redirect URL from the auth service.
                    // However to keep the example simple, we will always redirect to `/admin`.
                    const redirectUrl = '/GestionDropMonstreBis';

                    // Redirect the user
                    this.router.navigate([redirectUrl]);
                }
            }, (data: any) => {
                console.log(data);
                if (!this.authService.isAuth) {
                    this.afficherMessageErreur();
                }
            }
        ).catch(
            (data: any) => {
                console.log(data);
                if (!this.authService.isAuth) {
                    this.afficherMessageErreur();
                }
            }
        );
    }

    afficherMessageErreur() {
        this.message = 'Utilisateur ou mot de passe incorrect.';
    }

    loadSignIn() {
        this.router.navigate(['/signin']);
    }
}
