import {Component, OnInit} from '@angular/core';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../services/objet.service';
import {PersonnageService} from '../services/personnage.service';

@Component({
    selector: 'app-personnage',
    templateUrl: './personnage.component.html',
    styleUrls: ['./personnage.component.scss']
})
export class PersonnageComponent implements OnInit {

    personnages: Personnage[];

    currentPersonnage: Personnage;
    idPersonnageSelectionne: number;

    afficherStatistiquesSecondaires = false;

    objetMinimisations: ObjetMinimisation[];
    objetCourantID: number;

    constructor(private http: HttpClient,
                private objetService: ObjetService,
                private personnageService: PersonnageService) {
    }

    ngOnInit(): void {
        this.personnageService.getAllPersonnages(this.http, true).then(
            (data: any) => {
                const response = data as SpecialResponse;
                this.personnages = response.data as Personnage[];
            }
        );
    }

    selectPersonnage() {
        if (+this.idPersonnageSelectionne !== 0) {
            this.currentPersonnage = this.personnages.find(f => f.idPersonnage === +this.idPersonnageSelectionne);
            this.loadObjetsNames();
        }
    }

    public loadObjetsNames() {
        this.objetService.getAllObjetsNames(this.http, 1).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objetMinimisations = response.data as ObjetMinimisation[];
                console.log(this.objetMinimisations);
            }
        );
    }

    public selectObjet(idObjet: number) {
        this.objetCourantID = idObjet;
    }

    basedOn(statistique: string) {
        switch (statistique.toLowerCase()) {
            case 'intelligence':
                return Math.floor((this.currentPersonnage.intelligence - 10) / 2);
            case 'force':
                return Math.floor((this.currentPersonnage.force - 10) / 2);
            case 'agilite':
                return Math.floor((this.currentPersonnage.agilite - 10) / 2);
            case 'sagesse':
                return Math.floor((this.currentPersonnage.sagesse - 10) / 2);
            case 'constitution':
                return Math.floor((this.currentPersonnage.constitutuion - 10) / 2);
            case 'vitalite':
                return Math.floor((this.currentPersonnage.vitalite - 10) / 2);
            case 'mana':
                return Math.floor((this.currentPersonnage.mana - 10) / 2);
        }
    }

}
