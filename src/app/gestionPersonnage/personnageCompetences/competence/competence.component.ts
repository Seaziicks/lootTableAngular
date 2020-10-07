import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Competence} from '../MyReactComponentWrapper';
import {AuthService} from '../../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import equal from 'fast-deep-equal';

@Component({
    selector: 'app-competence',
    templateUrl: './competence.component.html',
    styleUrls: ['./competence.component.scss']
})
export class CompetenceComponent implements OnInit, OnChanges {

    modificationEnCours = false;
    valide = false;

    @Input() competence: Competence;
    competenceOriginal: Competence;

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.competenceOriginal = this.competence;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.competenceOriginal = this.competence;
    }

    trackByFn(index, item) {
        return index;
    }

    modifierContenu() {
        this.modificationEnCours = !this.modificationEnCours;
    }

    areDifferentCompetences(competence1: Competence, competence2: Competence): boolean {
        const objetTemp1 = JSON.parse(JSON.stringify(competence1)) as Competence;
        // objetTemp1.effetMagique = null;
        // objetTemp1.materiau = null;
        // objetTemp1.malediction = null;
        const objetTemp2 = JSON.parse(JSON.stringify(competence2)) as Competence;
        // objetTemp2.effetMagique = null;
        // objetTemp2.materiau = null;
        // objetTemp2.malediction = null;

        // console.log(objetTemp1);
        // console.log(objetTemp2);
        // console.log(JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2));
        // console.log(!equal(objetTemp1, objetTemp2)); // true
        // return JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2);
        return !equal(objetTemp1, objetTemp2);
    }

    selection() {
        // TODO: envoyer les informations au serveur
    }

    resetCompetence() {
        this.resetProprieteMagique();
        this.modificationEnCours = false;
    }

    resetProprieteMagique() {
        this.competence = JSON.parse(JSON.stringify(this.competenceOriginal)) as Competence;
        console.log(this.competence);
    }

}
