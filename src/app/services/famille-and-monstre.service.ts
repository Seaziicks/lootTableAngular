import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
// @ts-ignore
import {Famille, MonstreGroupe} from '../interface/MonstreGroupe';
import {BASE_URL, URL_FAMILLE_MONSTRE, URL_MONSTRE, URL_MONSTRES} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
    providedIn: 'root'
})
export class FamilleAndMonstreService {

    constructor() {
    }

    public chargerFamillesAvecMonstres(http: HttpClient): MonstreGroupe[] {
        const monstresGroupes: MonstreGroupe[] = [];
        const baseUrlBis = BASE_URL + URL_MONSTRES + '?withFamille=true';
        const applicationTypeObservable: Observable<SpecialResponse> =
            http.get<SpecialResponse>(baseUrlBis);
        const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
            (response) => {
                const familles: MonstreGroupe[] = response.data as MonstreGroupe[];
                for (const famille of familles) {
                    monstresGroupes.push(famille);
                }
                applicationTypeSubscription.unsubscribe();
            },
            (error) => {
                console.log('Une erreur est survenue dans la suscription: ' + error);
            },
            () => {
            }
        );
        return monstresGroupes;
    }

    public chargerAllFamilles(http: HttpClient): Famille[] {
        const allFamilles: Famille[] = [];
        const baseUrlBis = BASE_URL + URL_FAMILLE_MONSTRE;
        const applicationTypeObservable: Observable<SpecialResponse> =
            http.get<SpecialResponse>(baseUrlBis);
        const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
            (response) => {
                const familles: Famille[] = response.data as Famille[];
                for (const famille of familles) {
                    allFamilles.push(famille);
                }
                applicationTypeSubscription.unsubscribe();
            },
            (error) => {
                console.log('Une erreur est survenue dans la suscription: ' + error);
            },
            () => {
            }
        );
        return allFamilles;
    }

    /* ---------------------------------------------------*
    |           Partie familles & monstres                |
    *-----------------------------------------------------*/

    public async getFamillesAvecMonstres(http: HttpClient): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_MONSTRES + '?withFamille=true';
        return JSON.parse(await http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise()) as SpecialResponse;
    }

    /* ---------------------------------------------------*
    |                  Partie monstre                     |
    *-----------------------------------------------------*/

    public async creerMonstre(http: HttpClient, idFamilleMonstre: number, libelle: string): Promise<SpecialResponse> {
        const values = {idFamilleMonstre: undefined, libelle: undefined};
        values.idFamilleMonstre = idFamilleMonstre;
        values.libelle = libelle;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_MONSTRE;
        const params = new HttpParams().set('Monstre', JSON.stringify(values));

        const leretour = await http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise();
        console.log(leretour);

        return JSON.parse(leretour) as SpecialResponse;
    }

    public async modifierMonstre(http: HttpClient, idMonstre: number, idFamilleMonstre: number, libelle: string): Promise<SpecialResponse> {
        const values = {idMonstre: undefined, idFamilleMonstre: undefined, libelle: undefined};
        values.idMonstre = idMonstre;
        values.idFamilleMonstre = idFamilleMonstre === 0 ? 'NULL' : idFamilleMonstre;
        values.libelle = libelle;
        const baseUrlBis = BASE_URL + URL_MONSTRE + '?idMonstre=' + idMonstre;
        const params = new HttpParams().set('Monstre', JSON.stringify(values));

        return JSON.parse(await http.request('PUT', baseUrlBis, {responseType: 'text', params})
            .toPromise()) as SpecialResponse;
    }

    /* ---------------------------------------------------*
    |                  Partie famille                     |
    *-----------------------------------------------------*/

    public async getAllFamilles(http: HttpClient): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_FAMILLE_MONSTRE;
        return JSON.parse(await http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise()) as SpecialResponse;
    }

    public async creerFamille(http: HttpClient, libelle: string): Promise<SpecialResponse> {
        const values = {libelle: undefined};
        values.libelle = libelle;
        const baseUrlBis = BASE_URL + URL_FAMILLE_MONSTRE;
        const params = new HttpParams().set('Famille', JSON.stringify(values));
        return JSON.parse(await http.request('POST', baseUrlBis, {
            responseType: 'text',
            params
        }).toPromise()) as SpecialResponse;
    }

    public async modifierFamille(http: HttpClient, idFamilleMonstre: number, libelle: string): Promise<SpecialResponse> {
        const values = {idFamilleMonstre: undefined, libelle: undefined};
        values.idFamilleMonstre = idFamilleMonstre;
        values.libelle = libelle;
        const baseUrlBis = BASE_URL + URL_FAMILLE_MONSTRE + '?idFamilleMonstre=' + idFamilleMonstre;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Famille', JSON.stringify(values));

        const leretour = await http.request('PUT', baseUrlBis, {responseType: 'text', params}).toPromise();
        console.log(leretour);

        return JSON.parse(await http.request('PUT', baseUrlBis, {
            responseType: 'text',
            params
        }).toPromise()) as SpecialResponse;
    }
}
