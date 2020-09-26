import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_PERSONNAGE, URL_STATISTIQUE} from './rest.service';
import {HttpMethods} from '../interface/http-methods.enum';

@Injectable({
    providedIn: 'root'
})
export class PersonnageService {

    constructor() {
    }

    public getAllPersonnages(http: HttpClient, withStatistique: boolean) {
        const baseUrlBis = BASE_URL + URL_PERSONNAGE + '?withStatistique=' + withStatistique;
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    public getPersonnage(http: HttpClient, idPersonnage: number, withStatistique: boolean) {
        const baseUrlBis = BASE_URL + URL_PERSONNAGE + '?idPersonnage=' + idPersonnage + '&withStatistique=' + withStatistique;
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    getStatistiquesDetaillees(http: HttpClient, idPersonnage: number, details: boolean) {
        const baseUrlBis = BASE_URL + URL_STATISTIQUE + '?idPersonnage=' + idPersonnage + '&details=' + details;
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    getProgressionPersonnage(http: HttpClient) {
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php';
        console.log(baseUrlBis);
        return http.request('GET', baseUrlBis).toPromise();
    }

    progressionPersonnage(http: HttpClient, httpMethod: HttpMethods, idProgressionPersonnage: number,
                          progressionPersonnage: ProgressionPersonnage): Promise<string> {
        const values = {idProgressionPersonnage: undefined, ProgressionPersonnage: undefined};
        values.idProgressionPersonnage = idProgressionPersonnage;
        values.ProgressionPersonnage = progressionPersonnage;
        console.log(values);
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php' + '?idProgressionPersonnage=' + idProgressionPersonnage;
        console.log(baseUrlBis);
        const params = new HttpParams().set('ProgressionPersonnage', JSON.stringify(values));

        return http.request(httpMethod.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    getNiveauEnAttente(http: HttpClient, niveau: number): Promise<any> {
        const baseUrlBis = BASE_URL + 'progressionPersonnage.php?niveau=' + niveau;
        console.log(baseUrlBis);

        return http.request('GET', baseUrlBis).toPromise();
    }

    monterNiveau(http: HttpClient, httpMethod: HttpMethods, idPersonnage: number, niveau: StatistiquesParNiveau) {
        const values = {idPersonnage: undefined, Niveau: undefined};
        values.idPersonnage = idPersonnage;
        values.Niveau = niveau;
        console.log(values);
        const baseUrlBis = BASE_URL + 'monterNiveau.php' + '?idPersonnage=' + idPersonnage;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Niveau', JSON.stringify(values));

        return http.request(HttpMethods.POST.toString(), baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    gererNiveau(http: HttpClient, idPersonnage: number, monte: boolean) {
        const baseUrlBis = BASE_URL + 'monterNiveau.php' + '?idPersonnage=' + idPersonnage + '&monte=' + monte;
        console.log(baseUrlBis);

        return http.request(HttpMethods.GET.toString(), baseUrlBis).toPromise();
    }

}
