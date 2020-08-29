import {Component, OnInit} from '@angular/core';
import {BASE_URL} from '../services/rest.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MagicalProperty, SortedMagicalProperty} from '../interface/MonstreGroupe';
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

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'objetsMerveilleux').then(
            (effetsObjet: any) => {
                // console.log(effetsObjet);
                this.allProprietesMagiques = JSON.parse(effetsObjet) as SortedMagicalProperty;
                console.log(this.allProprietesMagiques);
            }
        );
    }

    testTable() {
        let sacAMalice: MagicalProperty;
        console.log(this.allProprietesMagiques.weakAndSmall[237]);
        sacAMalice = this.allProprietesMagiques.weakAndSmall[237];
        console.log(sacAMalice);
        const values = {idEffetMagique: undefined, Table: undefined};
        values.idEffetMagique = 2;
        values.Table = sacAMalice.table[0];
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueTables.php' + '?idEffetMagique=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueTable', JSON.stringify(values));
        return this.http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise().then(
            (data: any) => {
                console.log(data);
            }
        );
    }

    testUl() {
        let casqueDeMilleFeux: MagicalProperty;
        console.log(this.allProprietesMagiques);
        console.log(this.allProprietesMagiques.strongAnfPowerful[21]);
        casqueDeMilleFeux = this.allProprietesMagiques.strongAnfPowerful[21];
        console.log(casqueDeMilleFeux);
        const values = {idEffetMagique: undefined, Ul: undefined};
        values.idEffetMagique = 2;
        values.Ul = casqueDeMilleFeux.ul[0];
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueUl.php' + '?idEffetMagique=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueUl', JSON.stringify(values));
        return this.http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise().then(
            (data: any) => {
                console.log(data);
            }
        );
    }

    testDescriptions() {
        const values = {idEffetMagique: undefined, Descriptions: undefined};
        values.idEffetMagique = 2;
        values.Descriptions = this.allProprietesMagiques.strongAnfPowerful[21].description;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueDescription.php' + '?idEffet=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueDescriptions', JSON.stringify(values));

        return this.http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise().then(
            (data: any) => {
                console.log(data);
            }
        );
    }

    testInfos() {
        const values = {idEffetMagique: undefined, Infos: undefined};
        values.idEffetMagique = 2;
        values.Infos = this.allProprietesMagiques.strongAnfPowerful[21].infos.data;
        console.log(values);
        const baseUrlBis = BASE_URL + 'effetMagique/effetMagiqueInfos.php' + '?idEffet=' + 2 + '';
        console.log(baseUrlBis);
        const params = new HttpParams().set('EffetMagiqueInfos', JSON.stringify(values));

        return this.http.request('POST', baseUrlBis, {responseType: 'text', params}).toPromise().then(
            (data: any) => {
                console.log(data);
            }
        );
    }

}
