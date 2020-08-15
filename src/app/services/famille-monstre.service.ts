import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {MonstreGroupe} from '../interface/MonstreGroupe';
import {BASE_URL, URL_DROP_CHANCE, URL_FAMILLE_MONSTRE, URL_MONSTRE} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
  providedIn: 'root'
})
export class FamilleMonstreService {

  constructor() { }

  public chargerFamillesAvecMonstres(http: HttpClient): MonstreGroupe[] {
    const monstresGroupes: MonstreGroupe[] = [];
    const baseUrlBis = BASE_URL + URL_MONSTRE + '?withFamille=true';
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
    const baseUrlBis = BASE_URL + URL_MONSTRE + '?withFamille=true';
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
}
