import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_DROP_CHANCE, URL_EFFET_MAGIQUE, URL_OBJET_COMPLET} from './rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpMethods} from '../interface/http-methods.enum';

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
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '&idsOnly=true';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public getAllObjetsNames(http: HttpClient, idPersonnage: number) {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '&namesOnly=true';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public getObjetName(http: HttpClient, idObjet: number) {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idObjet=' + idObjet + '&nameOnly=true';
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

    public ulContent(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueUl: number, effetMagiqueUlContent: EffetMagiqueUlContent)
        : Promise<string> {
        const values = {idEffetMagiqueUl: undefined, EffetMagiqueUlContent: undefined};
        values.idEffetMagiqueUl = idEffetMagiqueUl;
        values.EffetMagiqueUlContent = effetMagiqueUlContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueUlContent.php' + '?idEffetMagiqueUl=' + idEffetMagiqueUl + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUlContent', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public ul(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueUl: EffetMagiqueUl): Promise<string> {
        const values = {idEffetMagique: undefined, EffetMagiqueUl: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueUl = effetMagiqueUl;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueUl.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public titleContent(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTableTitle: number,
                        effetMagiqueTableTitleContent: EffetMagiqueTableTitleContent): Promise<string> {
        const values = {idEffetMagiqueTableTitle: undefined, EffetMagiqueTableTitleContent: undefined};
        values.idEffetMagiqueTableTitle = idEffetMagiqueTableTitle;
        values.EffetMagiqueTableTitleContent = effetMagiqueTableTitleContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTitleContent.php'
            + '?idEffetMagiqueTableTitle=' + idEffetMagiqueTableTitle + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTitleContent', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public title(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTable: number, effetMagiqueTableTitle: EffetMagiqueTableTitle)
        : Promise<string> {
        const values = {idEffetMagiqueTable: undefined, EffetMagiqueTableTitle: undefined};
        values.idEffetMagiqueTable = idEffetMagiqueTable;
        values.EffetMagiqueTableTitle = effetMagiqueTableTitle;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTitle.php' + '?idEffetMagiqueTable=' + idEffetMagiqueTable + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTitle', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public trContent(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTableTr: number,
                     effetMagiqueTableTrContent: EffetMagiqueTableTrContent): Promise<string> {
        const values = {idEffetMagiqueTableTr: undefined, EffetMagiqueTableTrContent: undefined};
        values.idEffetMagiqueTableTr = idEffetMagiqueTableTr;
        values.EffetMagiqueTableTrContent = effetMagiqueTableTrContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTrContent.php'
            + '?idEffetMagiqueTableTr=' + idEffetMagiqueTableTr + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTrContent', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public tr(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTable: number, effetMagiqueTableTr: EffetMagiqueTableTr)
        : Promise<string> {
        const values = {idEffetMagiqueTable: undefined, EffetMagiqueTableTr: undefined};
        values.idEffetMagiqueTable = idEffetMagiqueTable;
        values.EffetMagiqueTableTr = effetMagiqueTableTr;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTr.php' + '?idEffetMagiqueTable=' + idEffetMagiqueTable + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTr', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public table(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueTable: EffetMagiqueTable): Promise<string> {
        const values = {idEffetMagique: undefined, EffetMagiqueTable: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueTable = effetMagiqueTable;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTable.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public effetMagique(http: HttpClient, httpMethod: HttpMethods, idObjet: number, effetMagique: EffetMagiqueDB): Promise<string> {
        const values = {idObjet: undefined, EffetMagique: undefined};
        values.idObjet = idObjet;
        values.EffetMagique = effetMagique;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagique.php' + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagique', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public description(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueDescription: EffetMagiqueDescription)
        : Promise<string> {
        const values = {idObjet: undefined, EffetMagiqueDescription: undefined};
        values.idObjet = idEffetMagique;
        values.EffetMagiqueDescription = effetMagiqueDescription;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescription', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public infos(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueInfos: EffetMagiqueDBInfos)
        : Promise<string> {
        const values = {idObjet: undefined, EffetMagiqueInfos: undefined};
        values.idObjet = idEffetMagique;
        values.EffetMagiqueInfos = effetMagiqueInfos;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueInfos.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueInfos', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public objet(http: HttpClient, httpMethod: HttpMethods, idPersonnage: number, objet: ObjetCommunFromDB)
        : Promise<string> {
        const objetCopie = JSON.parse(JSON.stringify(objet)) as ObjetCommunFromDB;
        objetCopie.effetMagique = null;
        objetCopie.malediction = null;
        objetCopie.materiau = null;
        const values = {idPersonnage: undefined, Objet: undefined};
        values.idPersonnage = idPersonnage;
        values.Objet = objetCopie;
        console.log(values);
        const baseUrlBis = BASE_URL + 'objetCompletRest.php' + '?idPersonnage=' + idPersonnage + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Objet', JSON.stringify(values));
        console.log(values);

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public malediction(http: HttpClient, httpMethod: HttpMethods, idMalediction: number, malediction: Malediction)
        : Promise<string> {
        const values = {idMalediction: undefined, Malediction: undefined};
        values.idMalediction = idMalediction;
        values.Malediction = malediction;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/maledictionRest.php' + '?idMalediction=' + idMalediction + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Malediction', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    public materiau(http: HttpClient, httpMethod: HttpMethods, idMateriaux: number, materiaux: Materiau)
        : Promise<string> {
        const values = {idMateriaux: undefined, Materiaux: undefined};
        values.idMateriaux = idMateriaux;
        values.Materiaux = materiaux;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/materiauRest.php' + '?idMateriaux=' + idMateriaux + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Materiaux', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }
}
