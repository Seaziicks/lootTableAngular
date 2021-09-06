import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_PERSONNAGE, URL_STATISTIQUE} from './rest.service';
import {HttpMethods} from '../interface/http-methods.enum';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
    providedIn: 'root'
})
export class PersonnageService {

    public personnageCourant: Personnage;

    constructor() {
    }

    public async getAllPersonnages(http: HttpClient, withStatistique: boolean): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_PERSONNAGE + '?withStatistique=' + withStatistique;
        console.log(baseUrlBis);
        return await http.get(baseUrlBis).toPromise() as SpecialResponse;
    }

    public async getPersonnage(http: HttpClient, idPersonnage: number, withStatistique: boolean): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_PERSONNAGE + '?idPersonnage=' + idPersonnage + '&withStatistique=' + withStatistique;
        console.log(baseUrlBis);
        return await http.request('GET', baseUrlBis).toPromise() as SpecialResponse;
    }

    async getStatistiquesDetaillees(http: HttpClient, idPersonnage: number, details: boolean): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_STATISTIQUE + '?idPersonnage=' + idPersonnage + '&details=' + details;
        console.log(baseUrlBis);
        return await http.request('GET', baseUrlBis).toPromise() as SpecialResponse;
    }

    async getProgressionPersonnage(http: HttpClient): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php';
        console.log(baseUrlBis);
        return await http.request('GET', baseUrlBis).toPromise() as SpecialResponse;
    }

    async progressionPersonnage(http: HttpClient, httpMethod: HttpMethods, idProgressionPersonnage: number,
                                progressionPersonnage: ProgressionPersonnage): Promise<SpecialResponse> {
        const values = {idProgressionPersonnage: undefined, ProgressionPersonnage: undefined};
        values.idProgressionPersonnage = idProgressionPersonnage;
        values.ProgressionPersonnage = progressionPersonnage;
        console.log(values);
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php' + '?idProgressionPersonnage=' + idProgressionPersonnage;
        console.log(baseUrlBis);
        const params = new HttpParams().set('ProgressionPersonnage', JSON.stringify(values));

        return await http.request(httpMethod.toString(), baseUrlBis, {responseType: 'json', params})
            .toPromise() as SpecialResponse;
    }

    async getNiveauEnAttente(http: HttpClient, niveau: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php?niveau=' + niveau;
        console.log(baseUrlBis);

        return await http.request('GET', baseUrlBis).toPromise() as SpecialResponse;
    }

    async monterNiveau(http: HttpClient, httpMethod: HttpMethods,
                       idPersonnage: number, niveau: StatistiquesParNiveau): Promise<SpecialResponse> {
        const values = {idPersonnage: undefined, Niveau: undefined};
        values.idPersonnage = idPersonnage;
        values.Niveau = niveau;
        console.log(values);
        const baseUrlBis = BASE_URL + 'monterNiveau.php' + '?idPersonnage=' + idPersonnage;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Niveau', JSON.stringify(values));

        return await http.request(HttpMethods.POST.toString(), baseUrlBis, {responseType: 'json', params})
            .toPromise() as SpecialResponse;
    }

    async gererNiveau(http: HttpClient, idPersonnage: number, monte: boolean): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'monterNiveau.php' + '?idPersonnage=' + idPersonnage + '&monte=' + monte;
        console.log(baseUrlBis);

        return await http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise() as SpecialResponse;
    }



    async getCompetences(http: HttpClient, idPersonnage: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + 'competenceRest.php?idPersonnage=' + idPersonnage;
        console.log(baseUrlBis);
        return await http.request('GET', baseUrlBis).toPromise() as SpecialResponse;
    }

}
