import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Materiau, MonstreLootChance} from '../interface/MonstreGroupe';
import {BASE_URL, URL_DROP_CHANCE} from './rest.service';

@Injectable({
    providedIn: 'root'
})
export class ObjetService {

    constructor() {
    }

    public envoyerObjet(http: HttpClient, httpMethod: string, idObjet: number, objet: any): Promise<string> {
        const values = {idObjet: undefined, Objet: undefined};
        values.idObjet = idObjet;
        values.Objet = objet;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Loot', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public envoyerMateriau(http: HttpClient, httpMethod: string, idMateriaux: number, materiau: Materiau): Promise<string> {
        const values = {idMateriaux: undefined, Materiau: undefined};
        values.idMateriaux = idMateriaux;
        values.Materiau = materiau;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMateriaux=' + idMateriaux + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Loot', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }
}
