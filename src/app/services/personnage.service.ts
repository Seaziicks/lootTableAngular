import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL, URL_PERSONNAGE, URL_STATISTIQUE} from './rest.service';

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

}
