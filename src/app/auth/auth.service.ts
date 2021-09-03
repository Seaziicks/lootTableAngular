import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpMethods} from '../interface/http-methods.enum';
import {BASE_URL} from '../services/rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {UserForCreation} from '../user/user-create/user-create.component';
import {UserSession} from '../user/user-login/user-login.component';
import {Router} from '@angular/router';

export class User {
    idUser: number;
    username: string;
    isGameMaster: false;
    isAdmin: false;
}

export class AuthService {

    isAuth = false;

    user: User;

    personnage: Personnage;

    redirectUrl: string;

    async signIn(http: HttpClient, username: string, password: string): Promise<SpecialResponse> {
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
        if (response.status === 200) {
            this.isAuth = true;
            this.user = response.data as User;
            this.personnage = response.data.personnage as Personnage;
        } else {
            throw new Error('Utilisateur ou mot de passe incorrect.');
        }
        return response;
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

    async getAllLeftPersonnage(http: HttpClient): Promise<SpecialResponse> {
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

    async checkUserInLocalStorage(http: HttpClient, router: Router, url: string = router.url) {
        const userSession = JSON.parse(localStorage.getItem('userSession')) as UserSession;
        if (userSession && ! this.isAuth) {
            await this.signIn(http, userSession.username, userSession.password);
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
        return await this.signIn(http, userSession.username, userSession.password);
    }
}
