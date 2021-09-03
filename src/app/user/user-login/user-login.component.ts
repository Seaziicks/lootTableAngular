import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SpecialResponse} from '../../loot-table/loot-table.component';

export class UserSession {
    username: string;
    password: string;
}

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

    public loginUserForm: FormGroup;

    hide = true;

    message: string;

    private timerUsername: any;
    usernameUnknown: boolean;
    lookingForUsernameAvailability = false;

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router) {
    }

    async ngOnInit() {
        this.loginUserForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.maxLength(19)]),
            password: new FormControl('', [Validators.required, Validators.minLength(9)]),
        });
        // console.log(this.router.url);
        // console.log(localStorage.getItem('userSession'));
        if (!this.authService.isAuth && localStorage.getItem('userSession')) {
            await this.authService.checkUserInLocalStorageAsPromise(this.http);
            if (this.authService.isAuth) {
                this.message = null;
                // Usually you would use the redirect URL from the auth service.
                // However to keep the example simple, we will always redirect to `/admin`.
                const redirectUrl = '/testPersonnage';

                // Redirect the user
                console.log(this.router.url);
                await this.router.navigate([redirectUrl]);
            }
        } else if (this.authService.isAuth) {
            const redirectUrl = '/testPersonnage';
            // console.log(this.router.url);
            await this.router.navigate([redirectUrl]);
        }
    }

    get username() {
        return this.loginUserForm.get('username');
    }

    get password() {
        return this.loginUserForm.get('password');
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.loginUserForm.controls[controlName].hasError(errorName);
    }

    onPasswordInput() {
        if (this.loginUserForm.hasError('missingPassword')) {
            this.password.setErrors({required: true});
        } else if (this.loginUserForm.hasError('passwordMismatch')) {
            this.loginUserForm.setErrors({passwordMismatch: true});
        } else if (this.loginUserForm.hasError('notLongEnoughPassword')) {
            this.password.setErrors({notLongEnoughPassword: true});
        } else {
            this.loginUserForm.setErrors(null);
        }
    }

    onUsernameInput() {
        if (this.loginUserForm.hasError('missingUsername')) {
            this.username.setErrors({required: true});
        } else if (this.loginUserForm.hasError('tooLongUsername')) {
            this.username.setErrors({maxLength: true});
        } else {
            this.checkUsernameAvailability();
        }
    }

    checkUsernameAvailability() {
        if (this.timerUsername){
            clearTimeout(this.timerUsername);
        }

        // trigger the search action after 400 millis
        if (this.username.value.length > 0) {
            this.timerUsername = setTimeout(() => {
                this.lookingForUsernameAvailability = true;
                this.searchUsername();
            }, 1500);
        }
    }

    searchUsername() {
        console.log(this.authService);
        this.authService.checkUsernameAvailable(this.http, this.username.value).then(
            (data: any) => {
                this.lookingForUsernameAvailability = false;
                console.log(data);
                if (this.username.hasError('maxlength')) {
                    this.username.setErrors({usernameUnknown: true, maxlength: true});
                } else {
                    this.username.setErrors({usernameUnknown: true});
                }
                setTimeout( () => { this.usernameUnknown = true; }, 10);
            }
        ).catch(
            (data: any) => {
                this.lookingForUsernameAvailability = false;
                console.log(data);
                const response: SpecialResponse = data as SpecialResponse;
                if (response.status === 409) {
                    this.username.setErrors(null);
                    this.usernameUnknown = false;
                }
            }
        );
    }

    async signIn() {
        const username = (document.getElementById('usernameUser') as HTMLInputElement).value;
        const password = (document.getElementById('passwordUser') as HTMLInputElement).value;
        console.log(username);
        console.log(password);
        try {
            const response: SpecialResponse = await this.authService.signIn(this.http, username, password);
            console.log(response);
            if (this.authService.isAuth) {
                localStorage.setItem('userSession', JSON.stringify({username, password}));
                this.message = null;
                // Usually you would use the redirect URL from the auth service.
                // However to keep the example simple, we will always redirect to `/admin`.
                const redirectUrl = '/testPersonnage';

                // Redirect the user
                await this.router.navigate([redirectUrl]);
            }
        } catch (error) {
            if (!this.authService.isAuth) {
                this.afficherMessageErreur('Utilisateur ou mot de passe incorrect.');
            }

        }
    }

    afficherMessageErreur(message: string) {
        this.message = message;
    }

    async loadSignIn() {
        await this.router.navigate(['/signin']);
    }

    afficherErrors() {
        console.log(this.loginUserForm.errors);
        console.log(this.loginUserForm.controls);
        console.log(this.username.errors);
        console.log(this.password.errors.key);
    }
}
