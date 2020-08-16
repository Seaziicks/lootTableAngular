import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
// @ts-ignore
import {MonstreGroupe} from '../interface/MonstreGroupe';
import {BASE_URL, URL_DROP_CHANCE, URL_FAMILLE_MONSTRE, URL_MONSTRE, URL_MONSTRES} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
  providedIn: 'root'
})
export class FamilleMonstreService {

  constructor() { }

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

  public getFamillesAvecMonstres(http: HttpClient): Promise<string> {
    const baseUrlBis = BASE_URL + URL_MONSTRES + '?withFamille=true';
    return http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();
  }

  public getAllFamilles(http: HttpClient): Promise<string> {
    const baseUrlBis = BASE_URL + URL_FAMILLE_MONSTRE;
    return http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();
  }

  public getFamille(http: HttpClient, idFamille: number): Promise<string> {
    const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idFamille=' + idFamille;
    return http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();
  }

  public creerMonstre(http: HttpClient, idFamilleMonstre: number, libelle: string): Promise<string> {
    const values = {idFamilleMonstre: undefined, libelle: undefined};
    values.idFamilleMonstre = idFamilleMonstre;
    values.libelle = libelle;
    console.log(values);
    const baseUrlBis = BASE_URL + URL_MONSTRE;
    console.log(baseUrlBis);
    const params = new HttpParams().set('Monstre', JSON.stringify(values));

    return http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise();
  }

  public modifierMonstre(http: HttpClient, idMonstre: number, idFamilleMonstre: number, libelle: string): Promise<string> {
    const values = {idMonstre: undefined, idFamilleMonstre: undefined, libelle: undefined};
    console.log(values);
    values.idMonstre = idMonstre;
    console.log(idFamilleMonstre);
    values.idFamilleMonstre = idFamilleMonstre === 0 ? 'NULL' : idFamilleMonstre;
    values.libelle = libelle;
    console.log(values);
    const baseUrlBis = BASE_URL + URL_MONSTRE + '?idMonstre=' + idMonstre;
    console.log(baseUrlBis);
    const params = new HttpParams().set('Monstre', JSON.stringify(values));

    return http.request('PUT', baseUrlBis, {responseType: 'text', params}).toPromise();
  }
}
