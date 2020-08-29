import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MagicalProperty, Malediction, Materiau, MonstreLootChance} from '../interface/MonstreGroupe';
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
        const params = new HttpParams().set('Objet', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public envoyerMalediction(http: HttpClient, httpMethod: string, idMalediction: number, malediction: Malediction): Promise<string> {
        const values = {idMalediction: undefined, Malediction: undefined};
        values.idMalediction = idMalediction;
        values.Malediction = malediction;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMalediction=' + idMalediction + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Malediction', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public envoyerMateriau(http: HttpClient, httpMethod: string, idMateriaux: number, materiau: Materiau): Promise<string> {
        const values = {idMateriaux: undefined, Materiau: undefined};
        values.idMateriaux = idMateriaux;
        values.Materiau = materiau;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMateriaux=' + idMateriaux + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Materiau', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public envoyerEffetMagique(http: HttpClient, httpMethod: string, idObjet: number, effet: MagicalProperty): Promise<string> {
        const values = {idEffetMagique: undefined, EffetMagique: undefined};
        values.idEffetMagique = idObjet;
        values.EffetMagique = effet;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagique', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public updateForObjet(http: HttpClient, idObjet: number, fieldToUpdate: string, value: number) {
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idObjet=' + idObjet + '&' + fieldToUpdate + '=' + value;
        console.log(baseUrlBis);
        return http.request('PUT', baseUrlBis).toPromise();
    }

    public envoyerDescriptions(http: HttpClient, httpMethod: string, idEffet: number, descriptions: string[]) {
        const values = {idEffetMagique: undefined, Descriptions: undefined};
        values.idEffetMagique = idEffet;
        values.Descriptions = descriptions;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffet=' + idEffet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescriptions', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }
}
