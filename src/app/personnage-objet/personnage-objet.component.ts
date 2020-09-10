import {Component, Input, OnInit} from '@angular/core';
import {ObjetService} from '../services/objet.service';
import {HttpClient} from '@angular/common/http';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
    selector: 'app-personnage-objet',
    templateUrl: './personnage-objet.component.html',
    styleUrls: ['./personnage-objet.component.scss']
})
export class PersonnageObjetComponent implements OnInit {

    @Input() id: number;

    objet: ObjetCommunFromDB;
    objetOriginal: ObjetCommunFromDB;

    modificationEnCours = false;
    valide = false;

    constructor(private http: HttpClient,
                private objetService: ObjetService) { }

    ngOnInit(): void {
        this.objetService.getObjetComplet(this.http, this.id).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as ObjetCommunFromDB;
                this.objetOriginal = JSON.parse(JSON.stringify(this.objet)) as ObjetCommunFromDB;
                console.log(this.objet);
            }
        );
    }

    trackByFn(index, item) {
        return index;
    }

    modifierContenu() {
        this.modificationEnCours = !this.modificationEnCours;
        this.checkProprietesMagiquesIntegrity();
    }

    resetContenu() {
        this.objet = JSON.parse(JSON.stringify(this.objetOriginal)) as ObjetCommunFromDB;
    }

    selection() {
        this.valide = !this.valide;
        if (this.valide && JSON.stringify(this.objetOriginal) !== JSON.stringify(this.objet)) {
            this.objetOriginal = JSON.parse(JSON.stringify(this.objet));
            // TODO: Envoyer l'objet modifié
        }
    }

    checkProprietesMagiquesIntegrity() {
        for (let i = 0 ; i < this.objet.proprieteMagique.length ; i++) {
            for (let indexDescription = 0 ; indexDescription < this.objet.proprieteMagique[i].description.length ; indexDescription++) {
                if (this.objet.proprieteMagique[i].description[indexDescription].length === 0) {
                    this.objet.proprieteMagique[i].description.splice(indexDescription, 1);
                    indexDescription--;
                }
            }
            if (this.objet.proprieteMagique[i].table) {
                for (let indexTable = 0; indexTable < this.objet.proprieteMagique[i].table.length; indexTable++) {
                    for (let indexTableTitle = 0; indexTableTitle <
                    this.objet.proprieteMagique[i].table[indexTable].title.length; indexTableTitle++) {
                        for (let indexTableTitleContent = 0; indexTableTitleContent <
                        this.objet.proprieteMagique[i].table[indexTable].title[indexTableTitle].length; indexTableTitleContent++) {
                            if
                            (this.objet.proprieteMagique[i].table[indexTable].title[indexTableTitle][indexTableTitleContent].length === 0) {
                                this.objet.proprieteMagique[i].table[indexTable].title[indexTableTitle].splice(indexTableTitleContent, 1);
                                indexTableTitleContent--;
                            }
                        }
                        if (this.objet.proprieteMagique[i].table[indexTable].title[indexTableTitle].length === 0) {
                            this.objet.proprieteMagique[i].table[indexTable].title.splice(indexTableTitle, 1);
                            indexTableTitle--;
                        }
                    }
                    for (let indexTableTr = 0; indexTableTr <
                    this.objet.proprieteMagique[i].table[indexTable].tr.length; indexTableTr++) {
                        for (let indexTableTrContent = 0; indexTableTrContent <
                        this.objet.proprieteMagique[i].table[indexTable].tr[indexTableTr].length; indexTableTrContent++) {
                            if (this.objet.proprieteMagique[i].table[indexTable].tr[indexTableTr][indexTableTrContent].length === 0) {
                                this.objet.proprieteMagique[i].table[indexTable].tr[indexTableTr].splice(indexTableTrContent, 1);
                                indexTableTrContent--;
                            }
                        }
                        if (this.objet.proprieteMagique[i].table[indexTable].tr[indexTableTr].length === 0) {
                            this.objet.proprieteMagique[i].table[indexTable].tr.splice(indexTableTr, 1);
                            indexTableTr--;
                        }
                    }
                    if (this.objet.proprieteMagique[i].table[indexTable].title.length === 0
                        && this.objet.proprieteMagique[i].table[indexTable].tr.length === 0) {
                        this.objet.proprieteMagique[i].table.splice(indexTable, 1);
                        indexTable--;
                    }
                }
            }
            if (this.objet.proprieteMagique[i].ul) {
                for (let indexUl = 0; indexUl < this.objet.proprieteMagique[i].ul.length; indexUl++) {
                    for (let indexLi = 0; indexLi < this.objet.proprieteMagique[i].ul[indexUl].li.length; indexLi++) {
                        if (this.objet.proprieteMagique[i].ul[indexUl].li[indexLi].length === 0) {
                            this.objet.proprieteMagique[i].ul[indexUl].li.splice(indexLi, 1);
                            indexLi--;
                        }
                    }
                    if (this.objet.proprieteMagique[i].ul.length === 0) {
                        this.objet.proprieteMagique[i].ul.splice(indexUl, 1);
                        indexUl--;
                    }
                }
            }

            if (this.objet.proprieteMagique[i].description.length === 0
                && !this.objet.proprieteMagique[i].table
                && !this.objet.proprieteMagique[i].ul) {
                console.log('Suppression de la propriete magique :' + this.objet.proprieteMagique[i].title);
                this.objet.proprieteMagique.splice(i, 1);
                i--;
            }
        }
    }

}
