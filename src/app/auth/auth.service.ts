import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpMethods} from '../interface/http-methods.enum';
import {BASE_URL} from '../services/rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

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
                const values = {Username: undefined, Password: undefined};
                values.Username = username;
                values.Password = password;
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
}
