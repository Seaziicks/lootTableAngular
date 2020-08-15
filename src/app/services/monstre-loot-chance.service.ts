import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_DROP_CHANCE} from './rest.service';

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
    console.log(values);
    const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMonstre=' + idMonstre + '&multipleInput=true';
    console.log(baseUrlBis);
    const params = new HttpParams().set('Loot', JSON.stringify(values));

    return http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
  }

  public getMonstreLootChanceTest(http: HttpClient, idMonstre: number): Promise<string> {
    const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMonstre=' + idMonstre;
    return http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();
  }

  public getLootPossibles(http: HttpClient): Promise<string> {
    return http.request('GET', BASE_URL + 'lootPossiblesRest.php', {responseType: 'text'}).toPromise();
  }
}
