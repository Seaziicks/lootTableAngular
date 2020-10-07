import {Component, OnInit} from '@angular/core';
import {SpecialResponse} from '../../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../../services/objet.service';
import {PersonnageService} from '../../services/personnage.service';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

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

    updatingObjetName = false;
    updatingObjetID: number;

    constructor(private http: HttpClient,
                private objetService: ObjetService,
                private personnageService: PersonnageService,
                public authService: AuthService,
                public router: Router) {
    }

    ngOnInit(): void {
        this.personnageService.getAllPersonnages(this.http, true).then(
            (data: any) => {
                console.log(data);
                const response = data as SpecialResponse;
                this.personnages = response.data as Personnage[];
            }
        );
    }

    selectPersonnage() {
        if (+this.idPersonnageSelectionne !== 0) {
            this.objetCourantID = null;
            this.currentPersonnage = this.personnages.find(f => f.idPersonnage === +this.idPersonnageSelectionne);
            this.loadObjetsNames();
        }
    }

    public loadObjetsNames() {
        this.objetService.getAllObjetsNames(this.http, this.idPersonnageSelectionne).then(
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
                return Math.floor((this.currentPersonnage.constitution - 10) / 2);
            case 'vitalite':
                return Math.floor((this.currentPersonnage.vitalite - 10) / 2);
            case 'mana':
                return Math.floor((this.currentPersonnage.mana - 10) / 2);
        }
    }

    reloadingObjet(idObjet: number) {
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

    getNomSansBalise(objetNom: string) {
        return objetNom.replace(/<a href="http:\/\/([a-z]*.*?)">(.*?)<\/a>/g, '$2');
    }

    allerAPageGestionPersonnage() {
        this.router.navigate(['/niveau', {id: this.idPersonnageSelectionne}]);
    }
    allerAPageCompetences() {
        this.router.navigate(['/competences', {id: this.idPersonnageSelectionne}]);
    }

    getIdPersonnage() {
        return this.idPersonnageSelectionne ? this.idPersonnageSelectionne
            : this.authService.personnage ? this.authService.personnage.idPersonnage : undefined;
    }
}
