import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-jwt-modal',
    templateUrl: './jwt-modal.component.html',
    styleUrls: ['./jwt-modal.component.scss']
})
export class JwtModalComponent implements OnInit {

    interval;

    remainingTime: Observable<number>;

    public loginUserForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.maxLength(19)]),
        password: new FormControl('', [Validators.required, Validators.minLength(9)]),
    });

    hide = true;

    message: string;

    private timerUsername: any;
    usernameUnknown: boolean;
    lookingForUsernameAvailability = false;

    reconnect = false;

    constructor(public dialogRef: MatDialogRef<JwtModalComponent>,
                @Inject(MAT_DIALOG_DATA) public expieryTime: number,
                private authService: AuthService,
                private http: HttpClient) {
    }

    ngOnInit(): void {
        // Pas sur que ce if soit necessaire, mais on sait jamais. On moins on est safe de ce cote la. (cf 2 commentaires plus bas)
        if (!this.remainingTime) {
            this.remainingTime = new Observable<number>(
                (observer: Observer<number>) => {
                    // Sinon la dialog ne doit attendre 1000 milisecondes avant d'avoir la valeur, ce qui affiche un blanc.
                    // Car l'interval attend une premiere fois avant de trigger une premiere fois.
                    observer.next(this.getRemainingTime(this.expieryTime));
                    // Je mets ca ici comme ca, sinon plusieurs interval se creent, et c'est le caca.
                    if (!this.interval) {
                        this.interval = setInterval(() => {
                            // console.log(this.getRemainingTime(this.expieryTime));
                            observer.next(this.getRemainingTime(this.expieryTime));
                        }, 1000);
                    }
                }
            );
        }
    }

    /**
     * Permet d'avoir le temps restant avant l'expiration du Jwt.
     * @param timeToSubstractFrom   La date d'expiration du Jwt.
     */
    getRemainingTime(timeToSubstractFrom: number) {
        const currentDate = this.authService.getCurrentTimeForJwt(); // Pour avoir un temps en secondes, et non en millisecondes.;
        return Math.floor(timeToSubstractFrom - currentDate);
    }

    onNoClick(): void {
        clearInterval(this.interval);
        this.dialogRef.close();
    }

    /**
     * Permet de savoir si on est dans la phase de reconnexion (usename / password) ou non.
     */
    triggerReconnect() {
        this.reconnect = !this.reconnect;
    }

    async signIn() {
        const username = (document.getElementById('usernameUser') as HTMLInputElement).value;
        const password = (document.getElementById('passwordUser') as HTMLInputElement).value;
        await this.authService.signIn(username, password);
        this.onNoClick();
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
        if (this.timerUsername) {
            clearTimeout(this.timerUsername);
        }

        // trigger the search action after 400 millis
        if (this.username.value.length > 0) {
            this.timerUsername = setTimeout(async () => {
                this.lookingForUsernameAvailability = true;
                await this.searchUsername();
            }, 1500);
        }
    }

    async searchUsername() {
        console.log(this.authService);
        try {
            const response: SpecialResponse = await this.authService.checkUsernameAvailable(this.http, this.username.value);
            console.log(response);
            this.lookingForUsernameAvailability = false;
            if (this.username.hasError('maxlength')) {
                this.username.setErrors({usernameUnknown: true, maxlength: true});
            } else {
                this.username.setErrors({usernameUnknown: true});
            }
            setTimeout(() => {
                this.usernameUnknown = true;
            }, 10);
        } catch (error) {
            console.log(error);
            this.lookingForUsernameAvailability = false;
            const response: SpecialResponse = error.error as SpecialResponse;
            if (response.status === 409) {
                this.username.setErrors(null);
                this.usernameUnknown = false;
            }
        }
    }
}
