import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpMethods} from '../interface/http-methods.enum';
import {BASE_URL, URL_OBJET_COMPLET} from '../services/rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {UserForCreation} from '../user/user-create/user-create.component';

export class User {
    idUser: number;
    userType: string;
    username: string;
}

export class AuthService {

    isAuth = false;

    user: User;

    personnage: Personnage;

    redirectUrl: string;

    signIn(http: HttpClient, username: string, password: string) {
        return new Promise(
            (resolve, rejects) => {
                const values = {username: undefined, password: undefined};
                values.username = username;
                values.password = password;
                console.log(values);
                const baseUrlBis = BASE_URL + 'connexion.php';
                console.log(baseUrlBis);

                const params = new HttpParams().set('Connexion', JSON.stringify(values));

                http.request(HttpMethods.GET.toString(), baseUrlBis, {responseType: 'text', params}).toPromise().then(
                    (data: any) => {
                        console.log(data);
                        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                        if (response.status === 200) {
                            this.isAuth = true;
                            resolve(true);
                        } else {
                            rejects(false);
                        }
                    }
                ).catch(
                    (data: any) => {
                        console.log(data);
                        const response: SpecialResponse = data as SpecialResponse;
                        if (response.status === 200) {
                            this.isAuth = true;
                            resolve(true);
                        } else {
                            rejects(false);
                        }
                    }
                );
            }
        );
    }

    signOut() {
        this.isAuth = false;
    }

    createUser(http: HttpClient, user: UserForCreation, personnage: Personnage): Promise<any> {
        const values = {User: undefined, Personnage: undefined};
        values.User = user;
        values.Personnage = personnage;
        console.log(values);
        const baseUrlBis = BASE_URL + 'connexion.php';
        console.log(baseUrlBis);

        const params = new HttpParams().set('Creation', JSON.stringify(values));

        return http.request(HttpMethods.POST.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    getAllLeftPersonnage(http: HttpClient) {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?leftPersonnage=true';
        console.log(baseUrlBis);
        return http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise();
    }

    checkUsernameAvailable(http: HttpClient, usernameToCheck: string) {
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
        return http.request(HttpMethods.GET.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    checkPersonnageNomAvailable(http: HttpClient, personnageNomToCheck: string) {
        const baseUrlBis = BASE_URL + 'connexion.php' + '?nomPersonnage=' + personnageNomToCheck + '&checkAvailable=true';
        console.log(baseUrlBis);
        return http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise();
    }
}
