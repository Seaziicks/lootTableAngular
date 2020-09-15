import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonnageService} from '../services/personnage.service';
import {ObjetService} from '../services/objet.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
    selector: 'app-gestion-objet',
    templateUrl: './gestion-objet.component.html',
    styleUrls: ['./gestion-objet.component.scss']
})
export class GestionObjetComponent implements OnInit {

    personnages: Personnage[];
    idPersonnageSelectionne: number;
    currentPersonnage: Personnage;

    objetMinimisations: ObjetMinimisation[] = [];

    objetCourantID: number;

    updatingObjetName = false;

    updatingObjetID: number;

    constructor(private http: HttpClient,
                private personnageService: PersonnageService,
                private objetService: ObjetService,
    ) {
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
        } else {
            this.currentPersonnage = null;
            this.objetMinimisations = null;
            // TODO: Récupérer tous les objets non assignés
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

    reloadObjetsNames(idObjet: number) {
        this.updatingObjetName = true;
        this.updatingObjetID = idObjet;
        setTimeout(() => {
            this.objetService.getObjetName(this.http, idObjet).then(
                (dataObjet: any) => {
                    const response: SpecialResponse = dataObjet as SpecialResponse;
                    console.log(response);
                    const index = this.objetMinimisations.indexOf(this.objetMinimisations.find(f => +f.idObjet === +idObjet));
                    this.objetMinimisations[index] = response.data as ObjetMinimisation;
                    console.log(this.objetMinimisations[index]);
                }
            );
        }, 1250);
        setTimeout(() => {
            this.updatingObjetName = false;
            this.updatingObjetID = null;
        }, 2500);
    }

    public selectObjet(idObjet: number) {
        this.objetCourantID = idObjet;
    }

}
