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

    public async updateForObjet(http: HttpClient, idObjet: number, fieldToUpdate: string, value: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idObjet=' + idObjet + '&' + fieldToUpdate + '=' + value;
        console.log(baseUrlBis);
        return await http.request(HttpMethods.PUT.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async envoyerDescriptions(http: HttpClient, httpMethod: string, idEffet: number, descriptions: string[])
        : Promise<SpecialResponse> {
        const values = {idEffetMagique: undefined, Descriptions: undefined};
        values.idEffetMagique = idEffet;
        values.Descriptions = descriptions;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffet=' + idEffet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescriptions', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise()) as SpecialResponse;
    }

    public async envoyerObjetComplet(http: HttpClient, httpMethod: string, idObjet: number, objet: any): Promise<SpecialResponse> {
        const values = {idObjet: undefined, Objet: undefined};
        values.idObjet = idObjet;
        values.Objet = objet;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Objet', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise()) as SpecialResponse;
    }

    public async getObjetComplet(http: HttpClient, idObjet: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async getEffetsMagiquesDecouverts(http: HttpClient, idObjet: number, idPersonnage: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDecouvert.php' + '?idObjet=' + idObjet + '&idPersonnage=' + idPersonnage +
        '&allDecouverts=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async effetsMagiquesDecouverts(http: HttpClient, httpMethod: HttpMethods, effetMagiqueDecouver: EffetMagiqueDecouvert)
        : Promise<SpecialResponse> {
        const values = {EffetMagiqueDecouvert: undefined};
        values.EffetMagiqueDecouvert = effetMagiqueDecouver;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDecouvert.php';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDecouvert', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async getAllObjetsComplets(http: HttpClient, idPersonnage: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async getAllObjetsIDs(http: HttpClient, idPersonnage: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '&idsOnly=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async getAllObjetsNames(http: HttpClient, idPersonnage: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idPersonnage=' + idPersonnage + '&namesOnly=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async getObjetName(http: HttpClient, idObjet: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_OBJET_COMPLET + '?idObjet=' + idObjet + '&nameOnly=true';
        console.log(baseUrlBis);
        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }

    public async envoyerEffetMagique(http: HttpClient, httpMethod: string, idObjet: number, effet: MagicalProperty)
        : Promise<SpecialResponse> {
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

        const response1: SpecialResponse = JSON.parse(await http.request(httpMethod, baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
        const idEffetMagique = response1.data.idEffetMagique;
        console.log(response1);
        console.log(response1.data);
        const response2: SpecialResponse = await this.envoyerEffetMagiqueTable(http, httpMethod, idEffetMagique, effet.table);
        console.log(response2);

        return await this.envoyerEffetMagiqueUl(http, httpMethod, idEffetMagique, effet.ul);
    }

    private async envoyerEffetMagiqueTable(http: HttpClient, httpMethod: string, idEffetMagique: number, effetTable: TableMagicalProperty[])
        : Promise<SpecialResponse> {
        const values = {idEffetMagique: undefined, EffetMagiqueTable: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueTable = effetTable;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_EFFET_MAGIQUE + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise()) as SpecialResponse;
    }

    private async envoyerEffetMagiqueUl(http: HttpClient, httpMethod: string, idEffetMagique: number, effetUl: UlMagicalProperty[])
        : Promise<SpecialResponse> {
        const values = {idEffetMagique: undefined, EffetMagiqueUl: undefined};
        values.idEffetMagique = idEffetMagique;
        values.EffetMagiqueUl = effetUl;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_EFFET_MAGIQUE + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise()) as SpecialResponse;
    }

    public async ulContent(http: HttpClient, httpMethod: HttpMethods,
                           idEffetMagiqueUl: number, effetMagiqueUlContent: EffetMagiqueUlContent): Promise<SpecialResponse> {
        const values = {idEffetMagiqueUl: undefined, EffetMagiqueUlContent: undefined};
        values.idEffetMagiqueUl = idEffetMagiqueUl;
        values.EffetMagiqueUlContent = effetMagiqueUlContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueUlContent.php' + '?idEffetMagiqueUl=' + idEffetMagiqueUl + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUlContent', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async ul(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueUl: EffetMagiqueUl)
        : Promise<SpecialResponse> {
        const effetMagiqueUlToUSe = {idEffetMagiqueUl: effetMagiqueUl.idEffetMagiqueUl,
            idEffetMagique: effetMagiqueUl.idEffetMagique,
            position: effetMagiqueUl.position};
        const values = {idEffetMagique: undefined, EffetMagiqueUl: effetMagiqueUlToUSe};
        values.idEffetMagique = idEffetMagique;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueUl.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async titleContent(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTableTitle: number,
                              effetMagiqueTableTitleContent: EffetMagiqueTableTitleContent): Promise<SpecialResponse> {
        const values = {idEffetMagiqueTableTitle: undefined, EffetMagiqueTableTitleContent: undefined};
        values.idEffetMagiqueTableTitle = idEffetMagiqueTableTitle;
        values.EffetMagiqueTableTitleContent = effetMagiqueTableTitleContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTitleContent.php'
            + '?idEffetMagiqueTableTitle=' + idEffetMagiqueTableTitle + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTitleContent', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async title(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTable: number,
                       effetMagiqueTableTitle: EffetMagiqueTableTitle): Promise<SpecialResponse> {
        const effetMagiqueTableTitleToUSe = {idEffetMagiqueTableTitle: effetMagiqueTableTitle.idEffetMagiqueTableTitle,
            idEffetMagiqueTable: effetMagiqueTableTitle.idEffetMagiqueTable};
        const values = {idEffetMagiqueTable: undefined, EffetMagiqueTableTitle: effetMagiqueTableTitleToUSe};
        values.idEffetMagiqueTable = idEffetMagiqueTable;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTitle.php' + '?idEffetMagiqueTable=' + idEffetMagiqueTable + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTitle', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async trContent(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTableTr: number,
                           effetMagiqueTableTrContent: EffetMagiqueTableTrContent): Promise<SpecialResponse> {
        const values = {idEffetMagiqueTableTr: undefined, EffetMagiqueTableTrContent: undefined};
        values.idEffetMagiqueTableTr = idEffetMagiqueTableTr;
        values.EffetMagiqueTableTrContent = effetMagiqueTableTrContent;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTrContent.php'
            + '?idEffetMagiqueTableTr=' + idEffetMagiqueTableTr + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTrContent', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async tr(http: HttpClient, httpMethod: HttpMethods, idEffetMagiqueTable: number, effetMagiqueTableTr: EffetMagiqueTableTr)
        : Promise<SpecialResponse> {
        const effetMagiqueTableTrToUSe = {idEffetMagiqueTableTr: effetMagiqueTableTr.idEffetMagiqueTableTr,
            idEffetMagiqueTable: effetMagiqueTableTr.idEffetMagiqueTable};
        const values = {idEffetMagiqueTable: undefined, EffetMagiqueTableTr: effetMagiqueTableTrToUSe};
        values.idEffetMagiqueTable = idEffetMagiqueTable;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTableTr.php' + '?idEffetMagiqueTable=' + idEffetMagiqueTable + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTableTr', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async table(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueTable: EffetMagiqueTable)
        : Promise<SpecialResponse> {
        const effetMagiqueTableToUSe = {idEffetMagiqueTable: effetMagiqueTable.idEffetMagiqueTable,
            idEffetMagique: effetMagiqueTable.idEffetMagique,
            position: effetMagiqueTable.position};
        const values = {idEffetMagique: undefined, EffetMagiqueTable: effetMagiqueTableToUSe};
        values.idEffetMagique = idEffetMagique;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTable.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async effetMagique(http: HttpClient, httpMethod: HttpMethods, idObjet: number, effetMagique: EffetMagiqueDB)
        : Promise<SpecialResponse> {
        const effetMagiqueToUSe = {idEffetMagique: effetMagique.idEffetMagique, idObjet: effetMagique.idObjet, title: effetMagique.title};
        const values = {idObjet: undefined, EffetMagique: effetMagiqueToUSe};
        values.idObjet = idObjet;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagique.php' + '?idObjet=' + idObjet + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagique', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async description(http: HttpClient, httpMethod: HttpMethods,
                             idEffetMagique: number, effetMagiqueDescription: EffetMagiqueDescription)
        : Promise<SpecialResponse> {
        const values = {idObjet: undefined, EffetMagiqueDescription: undefined};
        values.idObjet = idEffetMagique;
        values.EffetMagiqueDescription = effetMagiqueDescription;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescription', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async infos(http: HttpClient, httpMethod: HttpMethods, idEffetMagique: number, effetMagiqueInfos: EffetMagiqueDBInfos)
        : Promise<SpecialResponse> {
        const values = {idObjet: undefined, EffetMagiqueInfos: undefined};
        values.idObjet = idEffetMagique;
        values.EffetMagiqueInfos = effetMagiqueInfos;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueInfos.php' + '?idEffetMagique=' + idEffetMagique + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueInfos', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async objet(http: HttpClient, httpMethod: HttpMethods, idPersonnage: number, objet: ObjetCommunFromDB)
        : Promise<SpecialResponse> {
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

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async malediction(http: HttpClient, httpMethod: HttpMethods, idMalediction: number, malediction: Malediction)
        : Promise<SpecialResponse> {
        const values = {idMalediction: undefined, Malediction: undefined};
        values.idMalediction = idMalediction;
        values.Malediction = malediction;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/maledictionRest.php' + '?idMalediction=' + idMalediction + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Malediction', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    public async materiau(http: HttpClient, httpMethod: HttpMethods, idMateriaux: number, materiaux: Materiau)
        : Promise<SpecialResponse> {
        const values = {idMateriaux: undefined, Materiaux: undefined};
        values.idMateriaux = idMateriaux;
        values.Materiaux = materiaux;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/materiauRest.php' + '?idMateriaux=' + idMateriaux + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Materiaux', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }
}
