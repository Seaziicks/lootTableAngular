import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {MonstreGroupe} from '../interface/MonstreGroupe';
import {BASE_URL} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
  providedIn: 'root'
})
export class FamilleMonstreService {

  constructor() { }

  public chargerFamilles(http: HttpClient): MonstreGroupe[] {
    const monstresGroupes: MonstreGroupe[] = [];
    const baseUrlBis = BASE_URL + 'monstresRest.php?withFamille=true';
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
}
