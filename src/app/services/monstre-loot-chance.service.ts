import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';
// @ts-ignore
import {MonstreLootChance} from '../interface/MonstreGroupe';

@Injectable({
  providedIn: 'root'
})
export class MonstreLootChanceService {

  constructor() {
  }
  public addedRow: boolean[] = [];

  public envoyerLootChances(http: HttpClient, httpMethod: string, idMonstre: number, Loot: MonstreLootChance[]): Promise<string> {
    const values = {idMonstre: undefined, Loot: undefined};
    values.idMonstre = idMonstre;
    values.Loot = Loot;
    const baseUrlBis = BASE_URL + 'lootChanceRest.php';
    const params = new HttpParams().set('Loot', JSON.stringify(values));
    console.log(JSON.stringify(values));
    console.log(params);

    /* PUT is not working. Only POST don't rise error ... */
    // const requestType = this.ActionType === 5 ? 'POST' :  'PUT';

    return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
  }

  public getMonstreLootChanceTest(http: HttpClient, idMonstre: number): Promise<string> {
    const values = {idMonstre: undefined};
    values.idMonstre = idMonstre;
    const baseUrlBis = BASE_URL + 'lootChanceRest.php?idMonstre=' + idMonstre;
    console.log(baseUrlBis);
    const params = new HttpParams().set('param', JSON.stringify(values));
    console.log(JSON.stringify(values));
    console.log(params);

    return http.request('GET', baseUrlBis, {responseType: 'text', params}).toPromise();
  }

  public getLootPossibles(http: HttpClient): string[] {
    const monstreSelectionneLootPossibles: string[] = [];
    const baseUrlBis = BASE_URL + 'lootPossiblesRest.php';
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        const lootPossibles: string[] = response.data as string[];
        for (const lootPossible of lootPossibles) {
          monstreSelectionneLootPossibles.push(lootPossible);
        }
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
      }
    );
    return monstreSelectionneLootPossibles;
  }
}
