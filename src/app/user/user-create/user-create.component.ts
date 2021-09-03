import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SpecialResponse} from '../../loot-table/loot-table.component';

export interface UserForCreation {
    username: string;
    password: string;
    isGameMaster: false;
    isAdmin: false;
}

export const usernameValid: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('username').value.length < 1) {
        return {missingUsername: true};
    } else if (formGroup.get('username').value.length > 19) {
        return {tooLongUsername: true};
    } else {
        return null;
    }
};

export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value.length < 1) {
        return {missingPassword: true};
    } else if (formGroup.get('password').value.length < 9) {
        return {notLongEnoughPassword: true};
    }
    if (formGroup.get('password').value === formGroup.get('passwordRepeat').value) {
        return null;
    } else {
        return {passwordMismatch: true};
    }
};

export const personnageSelection: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (((document.getElementById('personnageName') as HTMLInputElement)
            && (document.getElementById('personnageName') as HTMLInputElement).value.length === 0)
        || ((document.getElementById('selectPersonnageRestant') as HTMLSelectElement)
            && (document.getElementById('selectPersonnageRestant') as HTMLSelectElement).value.length === 0)) {
        return {missingPersonnage: true};
    } else if (((document.getElementById('personnageName') as HTMLInputElement)
        && (document.getElementById('personnageName') as HTMLInputElement).value.length > 19)) {
        return {tooLongPersonnageName: true};
    } else {
        return null;
    }
};

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

    public createUserForm: FormGroup;

    passwordMismatch = false;

    hide = true;

    message: string;

    creationPersonnageChecked = false;
    personnageLeft = false;
    idPersonnage: number;

    leftPersonnage: PersonnageMinimisation[];

    private timerUsername: any;
    private timerPersonnageName: any;
    usernameUnavailable: boolean;
    personnageNameUnavailable: boolean;
    lookingForUsernameAvailability = false;
    lookingForPersonnageNameAvailability = false;

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router,
    ) {
    }

    async ngOnInit() {
        this.createUserForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.maxLength(19)]),
            password: new FormControl('', [Validators.required, Validators.minLength(9)]),
            passwordRepeat: new FormControl('', [Validators.required]),
            creationPersonnageChecked: new FormControl(''),
            personnageLeftChecked: new FormControl(''),
            personnage: new FormControl(''),
        }, [passwordMatchValidator, personnageSelection, usernameValid]);
        if (this.authService.isAuth) {
            this.message = null;
            // Usually you would use the redirect URL from the auth service.
            // However to keep the example simple, we will always redirect to `/admin`.
            const redirectUrl = '/testPersonnage';

            // Redirect the user
            await this.router.navigate([redirectUrl]);
        }
        try {
            const response: SpecialResponse = await this.authService.getAllLeftPersonnage(this.http);
            console.log(response);
            this.leftPersonnage = response.data as PersonnageMinimisation[];
            console.log(response.data as PersonnageMinimisation[]);
            console.log(this.leftPersonnage[0]);
        } catch(error) {
            console.log(error);
        }
    }

    get username() {
        return this.createUserForm.get('username');
    }

    get password() {
        return this.createUserForm.get('password');
    }

    get passwordRepeat() {
        return this.createUserForm.get('passwordRepeat');
    }

    get personnage() {
        return this.createUserForm.get('personnage');
    }

    onPasswordInput() {
        if (this.createUserForm.hasError('missingPassword')) {
            this.password.setErrors({required: true});
        } else if (this.createUserForm.hasError('passwordMismatch')) {
            this.passwordRepeat.setErrors({passwordMismatch: true});
        } else if (this.createUserForm.hasError('notLongEnoughPassword')) {
            this.password.setErrors({notLongEnoughPassword: true});
        } else {
            this.passwordRepeat.setErrors(null);
        }
    }

    onPersonnageInput() {
        if (this.createUserForm.hasError('missingPersonnage')) {
            this.personnage.setErrors({required: true});
        } else if (this.createUserForm.hasError('tooLongPersonnageName')) {
            this.personnage.setErrors({ma: true});
        } else {
            this.checkPersonnageNameAvailability();
        }
    }

    onUsernameInput() {
        if (this.createUserForm.hasError('missingUsername')) {
            this.username.setErrors({required: true});
        } else if (this.createUserForm.hasError('tooLongUsername')) {
            this.username.setErrors({tooLongPersonnageName: true});
        } else {
            this.checkUsernameAvailability();
        }
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.createUserForm.controls[controlName].hasError(errorName);
    }

    async signIn(usernameGiven: string, passwordGiven: string) {
        const username = usernameGiven ? usernameGiven : (document.getElementById('usernameUser') as HTMLInputElement).value;
        const password = passwordGiven ? passwordGiven : (document.getElementById('passwordUser') as HTMLInputElement).value;
        // const passwordRepeat = (document.getElementById('passwordUserRepeat') as HTMLInputElement).value;

        console.log(username);
        console.log(password);
        try {
            const response: SpecialResponse = await this.authService.signIn(this.http, username, password);
            console.log(response);
            if (this.authService.isAuth) {
                this.message = null;
                // Usually you would use the redirect URL from the auth service.
                // However to keep the example simple, we will always redirect to `/admin`.
                const redirectUrl = '/testPersonnage';

                // Redirect the user
                await this.router.navigate([redirectUrl]);
            }
        } catch (error) {
            console.log(error);
            if (!this.authService.isAuth) {
                this.afficherMessageErreur('Utilisateur ou mot de passe incorrect.');
            }
        }
    }

    createUser = async (userFormValue) => {
        if (this.createUserForm.valid) {
            await this.executeUserCreation(userFormValue);
        }
    }

    private executeUserCreation = async (userFormValue) => {
        const user: UserForCreation = {
            username: userFormValue.username,
            password: userFormValue.password,
            isAdmin: false,
            isGameMaster: false,
        };

        const personnageToAdd: Personnage = {
            idPersonnage: this.idPersonnage ? this.idPersonnage : null,
            nom: this.personnage.value ? this.personnage.value : null,
            niveau: 0,
            niveauEnAttente: 0,
            intelligence: 0,
            force: 0,
            agilite: 0,
            sagesse: 0,
            constitution: 0,
            vitalite: 0,
            deVitaliteNaturelle: 0,
            mana: 0,
            deManaNaturel: 0,
            statistiquesParNiveau: null,
        };

        try {
            const response: SpecialResponse = await this.authService.createUser(this.http, user, personnageToAdd);
            console.log(response);
            const userCreated: UserForCreation = response.data as UserForCreation;
            await this.signIn(userCreated.username, userCreated.password);
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = JSON.parse(error.error) as SpecialResponse;
            console.log(response);
            if (response.status === 409) {
                this.afficherMessageErreur('Cet username n\'est plus displonible.');
            }
        }
    }

    afficherMessageErreur(message: string) {
        this.message = message;
    }

    creationPersonnageCheckedFunction() {
        this.creationPersonnageChecked = !this.creationPersonnageChecked;
        if (!this.creationPersonnageChecked) {
            console.log(this.creationPersonnageChecked);
            this.idPersonnage = null;
            this.personnage.patchValue(null);
            this.personnage.clearValidators();
            this.personnage.updateValueAndValidity();
            this.createUserForm.updateValueAndValidity();
            setTimeout(() => {
                this.passwordRepeat.patchValue(this.passwordRepeat.value);
            }, 10);
        } else {
            this.personnage.setValidators([Validators.required]);
            this.personnage.updateValueAndValidity();
        }
        console.log(this.createUserForm.status);
    }

    personnageLeftFunction() {
        this.personnageLeft = !this.personnageLeft;
        if (!this.personnageLeft) {
            this.idPersonnage = null;
            this.personnage.patchValue(null);
        }
    }

    selectionPersonnage() {
        const personnage = (document.getElementById('selectPersonnageRestant') as HTMLSelectElement).value;
        if (personnage.length > 0) {
            this.idPersonnage = this.leftPersonnage.find(f => f.nom === personnage).idPersonnage;
        }
        console.log(this.idPersonnage);
    }

    checkUsernameAvailability() {
        if (this.timerUsername) {
            clearTimeout(this.timerUsername);
        }

        // trigger the search action after 400 millis
        this.timerUsername = setTimeout(async () => {
            this.lookingForUsernameAvailability = true;
            await this.searchUsername();
        }, 1500);
    }

    async searchUsername() {
        console.log(this.authService);
        try {
            const response: SpecialResponse = await this.authService.checkUsernameAvailable(this.http, this.username.value);
            console.log(response);
            this.lookingForUsernameAvailability = false;
            this.username.setErrors(null);
            this.usernameUnavailable = false;
        } catch(error) {
            console.log(error);
            const response: SpecialResponse = error.error as SpecialResponse;
            if (response.status === 409) {
                this.username.setErrors({unavailableUsername: true});
                setTimeout(() => {
                    this.usernameUnavailable = true;
                }, 10);
            }
        }
    }

    checkPersonnageNameAvailability() {
        if (this.timerPersonnageName) {
            clearTimeout(this.timerPersonnageName);
        }

        // trigger the search action after 400 millis
        this.timerPersonnageName = setTimeout(async () => {
            this.lookingForPersonnageNameAvailability = true;
            await this.searchPersonnageName();
        }, 1500);
    }

    async searchPersonnageName() {
        console.log(this.authService);
        try {
            const response: SpecialResponse = await this.authService.checkPersonnageNomAvailable(this.http, this.personnage.value);
            console.log(response);
            this.lookingForPersonnageNameAvailability = false;
            this.personnage.setErrors(null);
            this.personnageNameUnavailable = false;
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = error.error as SpecialResponse;
            this.lookingForPersonnageNameAvailability = false;
            if (response.status === 409) {
                this.personnage.setErrors({unavailablePersonnageName: true});
                setTimeout(() => {
                    this.personnageNameUnavailable = true;
                }, 10);
            }
        }
    }

    afficherErrors() {
        console.log(this.createUserForm.errors);
        console.log(this.password.errors);
        console.log(this.passwordRepeat.errors);
        console.log(this.username.errors);
        console.log(this.personnage.errors);
    }

    async loadLogIn() {
        await this.router.navigate(['/login']);
    }
}
