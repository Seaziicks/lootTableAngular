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

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService
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
            this.isAuth = true;
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(response.data);
            this.user = {
                username: decodedToken.username,
                idUser: decodedToken.idUser,
                isAdmin: decodedToken.isAdmin,
                isGameMaster: decodedToken.isGameMaster,
                jwtToken: response.data
            } as User;
            console.log(decodedToken);
            this.localStorageService.set(LocalStorageService.JWTToken, response.data);
            this.personnage = response.data.personnage as Personnage ? response.data.personnage as Personnage : null;
        } else {
            throw new Error('Utilisateur ou mot de passe incorrect.');
        }
        return response;
    }

    getJWTToken() {
        if (!this.localStorageService.get(LocalStorageService.JWTToken)
            || this.localStorageService.get(LocalStorageService.JWTToken) == null) {
            throw new JWTTokenError(JWTTokenError.TOKEN_NON_TROUVE);
        }
        return this.localStorageService.get(LocalStorageService.JWTToken);
    }

    getJwtExpieryTime() {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(this.getJWTToken());
        return decodedToken.exp;
    }

    signOut() {
        this.user = null;
        this.personnage = null;
        this.isAuth = false;
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

    async getAllUnassignedPersonnage(http: HttpClient): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?leftPersonnage=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
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

    async checkPersonnageNomAvailable(http: HttpClient, personnageNomToCheck: string): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?nomPersonnage=' + personnageNomToCheck + '&checkAvailable=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
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

    async checkUserInLocalStorageAsPromise(http: HttpClient) {
        const userSession = JSON.parse(localStorage.getItem('userSession')) as UserSession;
        return await this.signIn(userSession.username, userSession.password);
    }

    public getPersonnage(): Personnage {

        return ((JSON.parse(JSON.stringify(this.personnage))) as Personnage);
    }

    public resetPersonnage() {
        this.personnage = null;
    }
}
