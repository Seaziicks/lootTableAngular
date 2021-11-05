import {Component, OnInit} from '@angular/core';
import {BACKEND_URL} from '../services/rest.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {JSonLoadService} from '../services/json-load.service';

@Component({
    selector: 'app-test-insert-table',
    templateUrl: './test-insert-table.component.html',
    styleUrls: ['./test-insert-table.component.scss']
})
export class TestInsertTableComponent implements OnInit {

    allProprietesMagiques: SortedMagicalProperty;

    constructor(private http: HttpClient,
                private jsonService: JSonLoadService) {
    }

    async ngOnInit() {
        const donnees = await this.jsonService.getJSON('magique', 'objetsMerveilleux');
        console.log(donnees);
        this.allProprietesMagiques = donnees as SortedMagicalProperty;
        console.log(this.allProprietesMagiques);
    }

    async testTable() {
        let sacAMalice: MagicalProperty;
        console.log(this.allProprietesMagiques.weakAndSmall[237]);
        sacAMalice = this.allProprietesMagiques.weakAndSmall[237];
        console.log(sacAMalice);
        const values = {idEffetMagique: undefined, Table: undefined};
        values.idEffetMagique = 2;
        values.Table = sacAMalice.table[0];
        console.log(values);
        const baseUrlBis = BACKEND_URL + 'effetMagique/effetMagiqueTable.php' + '?idEffetMagique=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));
        const data = await this.http.request('POST', baseUrlBis, {responseType: 'json', params}).toPromise();
        console.log(data);
        return data;
    }

    async testUl() {
        let casqueDeMilleFeux: MagicalProperty;
        console.log(this.allProprietesMagiques);
        console.log(this.allProprietesMagiques.strongAnfPowerful[21]);
        casqueDeMilleFeux = this.allProprietesMagiques.strongAnfPowerful[21];
        console.log(casqueDeMilleFeux);
        const values = {idEffetMagique: undefined, Ul: undefined};
        values.idEffetMagique = 2;
        values.Ul = casqueDeMilleFeux.ul[0];
        console.log(values);
        const baseUrlBis = BACKEND_URL + 'effetMagique/effetMagiqueUl.php' + '?idEffetMagique=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));
        const data = await this.http.request('POST', baseUrlBis, {responseType: 'json', params}).toPromise();
        console.log(data);
        return data;
    }

    async testDescriptions() {
        const values = {idEffetMagique: undefined, Descriptions: undefined};
        values.idEffetMagique = 2;
        values.Descriptions = this.allProprietesMagiques.strongAnfPowerful[21].description;
        console.log(values);
        const baseUrlBis = BACKEND_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffet=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescriptions', JSON.stringify(values));

        const data = await this.http.request('POST', baseUrlBis, {responseType: 'json', params}).toPromise();
        console.log(data);
        return data;
    }

    async testInfos() {
        const values = {idEffetMagique: undefined, Infos: undefined};
        values.idEffetMagique = 2;
        values.Infos = this.allProprietesMagiques.strongAnfPowerful[21].infos.data;
        console.log(values);
        const baseUrlBis = BACKEND_URL + 'effetMagique/effetMagiqueInfos.php' + '?idEffet=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueInfos', JSON.stringify(values));

        const data = await this.http.request('POST', baseUrlBis, {responseType: 'json', params}).toPromise();
        console.log(data);
        return data;
    }

}
