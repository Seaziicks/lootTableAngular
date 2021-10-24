import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpMethods} from '../interface/http-methods.enum';
import {BASE_URL} from '../services/rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {UserForCreation} from '../user/user-create/user-create.component';
import {UserSession} from '../user/user-login/user-login.component';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LocalStorageService} from '../services/local-storage.service';
import {Injectable} from '@angular/core';
import {JWTTokenError} from '../errors/JWTToken.error';
import {JwtModalComponent} from '../jwt-modal/jwt-modal.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

export class User {
    idUser: number;
    username: string;
    isGameMaster: boolean;
    isAdmin: boolean;
    jwtToken: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isAuth = false;

    user: User;

    // Personnage reçu après avoir été identifié. Ne devrait pas être accessible par tout le monde.
    private personnage: Personnage = null;

    redirectUrl: string;

    jwtModalDialogOpened = false;
    lastModalRefused: number;
    jwtModalDialog: MatDialogRef<JwtModalComponent, any>;

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private dialog: MatDialog
    ) {}

    async signIn(username: string, password: string): Promise<SpecialResponse> {
        /*
        const values = {username: undefined, password: undefined};
        values.username = username;
        values.password = password;
        console.log(values);
        const baseUrlBis = BASE_URL + 'connexion.php';
        console.log(baseUrlBis);

        const params = new HttpParams().set('Connexion', JSON.stringify(values));

        const response: SpecialResponse = await http.request(HttpMethods.GET.toString(), baseUrlBis, {
            responseType: 'json',
            params
        }).toPromise() as SpecialResponse;
        console.log(response);
        */
        /*
        if (response.status === 200) {
            this.isAuth = true;
            this.user = response.data as User;
            this.personnage = response.data.personnage as Personnage ? response.data.personnage as Personnage : null;
        } else {
            throw new Error('Utilisateur ou mot de passe incorrect.');
        }
        */
        return await this.acquireJWTToken(this.http, username, password);
    }

    async acquireJWTToken(http: HttpClient, username: string, password: string) {
        const values = {username: undefined, password: undefined};
        values.username = username;
        values.password = password;
        console.log(values);
        const baseUrlBis = BASE_URL + 'JWTToken.php';
        console.log(baseUrlBis);

        const params = new HttpParams().set('Connexion', JSON.stringify(values));

        const response: SpecialResponse = await http.request(HttpMethods.GET.toString(), baseUrlBis, {
            responseType: 'json',
            params
        }).toPromise() as SpecialResponse;

        console.log(response);

        if (response.status === 200) {
            this.setUserFromJwt(response.data);
        } else {
            throw new Error('Utilisateur ou mot de passe incorrect.');
        }
        return response;
    }

    setUserFromJwt(Jwt: any) {
        this.isAuth = true;
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(Jwt);
        this.user = {
            username: decodedToken.username,
            idUser: decodedToken.idUser,
            isAdmin: decodedToken.isAdmin,
            isGameMaster: decodedToken.isGameMaster,
            jwtToken: Jwt
        } as User;
        console.log(decodedToken);
        this.localStorageService.set(LocalStorageService.JWTToken, Jwt);
        this.personnage = Jwt.personnage as Personnage ? Jwt.personnage as Personnage : null;
    }

    getJwtToken() {
        if (!this.localStorageService.get(LocalStorageService.JWTToken)
            || this.localStorageService.get(LocalStorageService.JWTToken) == null) {
            throw new JWTTokenError(JWTTokenError.TOKEN_NON_TROUVE);
        }
        return this.localStorageService.get(LocalStorageService.JWTToken);
    }

    /**
     * Renvoie la date d'expiration du Jwt, au format Unix timestamp.
     */
    getJwtExpieryTime(): number {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(this.getJwtToken());
        return decodedToken.exp;
    }

    /**
     * Renvoie le temps avant expiration du Jwt.
     */
    getJwtExpieryDelay(): number {
        const JwtExpieryTime = new Date(this.getJwtExpieryTime()).getTime(); // convert string date to Date object
        const currentDate = this.getCurrentTimeForJwt(); // Pour avoir un temps en secondes, et non en millisecondes.
        return Math.floor(JwtExpieryTime - currentDate);
    }

    getCurrentTimeForJwt(): number {
        return Math.floor((new Date().getTime()) / 1000);
    }

    jwtHasExpired(): boolean {
        return (Math.floor(this.getCurrentTimeForJwt()) >= this.getJwtExpieryTime());
    }

    checkJwtInLocalStorage(): void {
        try {
            if (this.getJwtToken() && !this.jwtHasExpired()) {
                console.log('Je set la session.');
                this.setUserFromJwt(this.getJwtToken());
                this.openJwtRefreshDialog();
            }
        } catch (e) {
            if (e instanceof JWTTokenError) {
                console.log('Pas de Jwt trouvé.');
            }
        }
    }

    signOut() {
        console.log('J\'ai sign out');
        this.user = null;
        this.personnage = null;
        this.isAuth = false;
        if (!!this.getJwtToken() && (this.jwtHasExpired() || this.getJwtExpieryDelay() < 30)) {
            // On enlève le token si expiré, pour éviter des incoherences d'etat. Et si il reste moins de 30 secondes.
            this.localStorageService.remove(LocalStorageService.JWTToken);
        }
        if (this.jwtModalDialogOpened) {
            this.jwtModalDialog.componentInstance.onNoClick();
            this.jwtModalDialog.close();
        }
    }

    async createUser(http: HttpClient, user: UserForCreation, personnage: Personnage): Promise<SpecialResponse> {
        const values = {User: undefined, Personnage: undefined};
        values.User = user;
        values.Personnage = personnage;
        console.log(values);
        const baseUrlBis = BASE_URL + 'connexion.php';
        console.log(baseUrlBis);

        const params = new HttpParams().set('Creation', JSON.stringify(values));

        return await http.request(HttpMethods.POST.toString(), baseUrlBis, {responseType: 'json', params}).toPromise() as SpecialResponse;
    }

    /**
     * Permet de recupere tous les personnages cres mais non assignes à des users.
     */
    async getAllUnassignedPersonnage(): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?leftPersonnage=true';
        console.log(baseUrlBis);
        return await this.http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    async checkUsernameAvailable(http: HttpClient, usernameToCheck: string): Promise<SpecialResponse> {
        const fakeUser: UserForCreation = {
            username: usernameToCheck,
            password: null,
            isGameMaster: null,
            isAdmin: null,
        };
        const values = {User: undefined};
        values.User = fakeUser;
        const params = new HttpParams().set('User', JSON.stringify(values));
        const baseUrlBis = BASE_URL + 'connexion.php' + '?checkAvailable=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis, {responseType: 'json', params}).toPromise() as SpecialResponse;
    }

    async checkPersonnageNameAvailable(personnageNomToCheck: string): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?nomPersonnage=' + personnageNomToCheck + '&checkAvailable=true';
        console.log(baseUrlBis);
        return await this.http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    isAdmin() {
        return !!(this.user && this.user.isAdmin);
    }

    isGameMaster() {
        return !!(this.user && (this.user.isGameMaster || this.isAdmin()));
    }

    isAuthenticated() {
        return this.isAuth;
    }

    async checkUserInLocalStorage(router: Router, url: string = router.url) {
        const userSession = JSON.parse(localStorage.getItem('userSession')) as UserSession;
        if (userSession && ! this.isAuth) {
            await this.signIn(userSession.username, userSession.password);
            if (this.isAuth) {
                // Usually you would use the redirect URL from the auth service.
                // However to keep the example simple, we will always redirect to `/admin`.

                // Redirect the user
                await router.navigate([url]);
            }
        }
    }

    async checkUserInLocalStorageAsPromise() {
        const userSession = JSON.parse(localStorage.getItem('userSession')) as UserSession;
        return await this.signIn(userSession.username, userSession.password);
    }

    public getPersonnage(): Personnage {
        return ((JSON.parse(JSON.stringify(this.personnage))) as Personnage);
    }

    public resetPersonnage() {
        this.personnage = null;
    }

    /**
     * Permet de generer la modale Jwt. Cette modale permet de prevenir l'utilisateur que le Jwt va expirer.
     * Elle lui permet egalement de s'authentifier de nouveau, sans aller sur la page de login.
     */
    openJwtRefreshDialog(): void {
        const jwtExpieryDelay = this.getJwtExpieryDelay();
        const currentTimeForJwt = this.getCurrentTimeForJwt();
        const lastJwtModalAskedDelay = Math.floor(currentTimeForJwt - this.lastModalRefused);
        if ((jwtExpieryDelay < 300 && (!this.lastModalRefused || lastJwtModalAskedDelay > 45))
            || this.jwtHasExpired() || jwtExpieryDelay < 15) {
            // Si je suis a moins de 5 minutes de l'expiration et que je n'ai pas demandé depuis 45s, je previens l'utilisateur.
            if (!this.jwtModalDialogOpened) {
                this.jwtModalDialogOpened = true;
                this.jwtModalDialog = this.dialog.open(JwtModalComponent, {
                    // width: '250px',
                    data: new Date(this.getJwtExpieryTime()).getTime(),
                    disableClose: true,
                    hasBackdrop: false,
                    position: {top: '64px', right: '10px'}
                });

                this.jwtModalDialog.afterClosed().subscribe(result => {
                    clearInterval(this.jwtModalDialog.componentInstance.interval);
                    this.lastModalRefused = currentTimeForJwt;
                    this.jwtModalDialogOpened = false;
                    // console.log(result);
                    if (result) {
                        console.log(result);
                    }
                });
            }
        }
    }
}
