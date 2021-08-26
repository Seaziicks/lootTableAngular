import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_DROP_CHANCE, URL_DROP_CHANCE_BIS} from './rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
    providedIn: 'root'
})
export class MonstreLootChanceService {

    constructor() {
    }

    /*public addedRow: boolean[] = [];*/

    public async envoyerLootChances(http: HttpClient, httpMethod: string, idMonstre: number, Loot: MonstreLootChance[])
        : Promise<SpecialResponse> {
        const values = {idMonstre: undefined, Loot: undefined};
        values.idMonstre = idMonstre;
        values.Loot = Loot;
        console.log(values);
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMonstre=' + idMonstre + '&multipleInput=true';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Loot', JSON.stringify(values));

        return JSON.parse(await http.request(httpMethod, baseUrlBis, {
            responseType: 'text',
            params
        }).toPromise()) as SpecialResponse;
    }

    public async envoyerLootChancesBis(http: HttpClient, httpMethod: string, idMonstre: number, Loot: MonstreLootChanceBis[])
        : Promise<SpecialResponse> {
        const values = {idMonstre: undefined, Loot: undefined};
        values.idMonstre = idMonstre;
        values.Loot = Loot;
        for (let i = 0; i < values.Loot.length; i++) {
            values.Loot[i].idLoot = +values.Loot[i].idLoot === 0 ? null : +values.Loot[i].idLoot;
        }
        console.log(httpMethod);
        console.log(JSON.stringify(values.Loot));
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE_BIS + '?idMonstre=' + idMonstre + '&multipleInput=true';
        console.log(baseUrlBis);
        const params = new HttpParams().set('Loot', JSON.stringify(values));

        const retour = await http.request(httpMethod, baseUrlBis, {responseType: 'text', params}).toPromise();
        console.log(retour);

        return JSON.parse(retour) as SpecialResponse;
    }

    public async getMonstreLootChanceTest(http: HttpClient, idMonstre: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE + '?idMonstre=' + idMonstre;
        return JSON.parse(await http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise()) as SpecialResponse;
    }

    public async getMonstreLootChanceBis(http: HttpClient, idMonstre: number): Promise<SpecialResponse> {
        const baseUrlBis = BASE_URL + URL_DROP_CHANCE_BIS + '?idMonstre=' + idMonstre;
        return JSON.parse(await http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise()) as SpecialResponse;
    }

    public async getLootPossibles(http: HttpClient): Promise<SpecialResponse> {
        return JSON.parse(await http.request('GET', BASE_URL + 'lootPossiblesRest.php', {responseType: 'text'})
            .toPromise()) as SpecialResponse;
    }
}
