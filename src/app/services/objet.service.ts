import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_DROP_CHANCE, URL_EFFET_MAGIQUE, URL_OBJET_COMPLET} from './rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
    providedIn: 'root'
})
export class ObjetService {

    constructor() {
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

    public envoyerObjetComplet(http: HttpClient, httpMethod: string, idObjet: number, objet: any): Promise<string> {
        const values = {idObjet: undefined, Objet: undefined};
        values.idObjet = idObjet;
        values.Objet = objet;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Objet', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public getObjetComplet(http: HttpClient, idObjet: number) {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public getAllObjetsComplets(http: HttpClient, idPersonnage: number) {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public getAllObjetsIDs(http: HttpClient, idPersonnage: number) {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '&idsOnly = true';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public envoyerEffetMagique(http: HttpClient, httpMethod: string, idObjet: number, effet: MagicalProperty): Promise<string> {
        const effetModified: MagicalProperty = JSON.parse(JSON.stringify(effet)) as MagicalProperty;
        effetModified.table = null;
        effetModified.ul = null;
        const values = {idObjet: undefined, EffetMagique: undefined};
        values.idObjet = idObjet;
        values.EffetMagique = effetModified;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_EFFET_MAGIQUE + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagique', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise().then(
            (dataEffetMagique: any) => {
                console.log(dataEffetMagique);
                const response: SpecialResponse = JSON.parse(dataEffetMagique) as SpecialResponse;
                const idEffetMagique = response.data.idEffetMagique;
                console.log(response);
                console.log(response.data);
                return this.envoyerEffetMagiqueTable(http, httpMethod, idEffetMagique, effet.table).then(
                    (dataEffetMagiqeTable: any) => {
                        console.log(dataEffetMagiqeTable);
                        return this.envoyerEffetMagiqueUl(http, httpMethod, idEffetMagique, effet.ul);
                    }
                );
            }
        );
    }

    private envoyerEffetMagiqueTable(http: HttpClient, httpMethod: string, idEffetMagique: number, effetTable: TableMagicalProperty[])
        : Promise<string> {
        const values = {idEffetMagique: undefined, EffetMagiqueTable: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueTable = effetTable;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_EFFET_MAGIQUE + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    private envoyerEffetMagiqueUl(http: HttpClient, httpMethod: string, idEffetMagique: number, effetUl: UlMagicalProperty[])
        : Promise<string> {
        const values = {idEffetMagique: undefined, EffetMagiqueUl: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueUl = effetUl;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_EFFET_MAGIQUE + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));

        return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
    }
}
