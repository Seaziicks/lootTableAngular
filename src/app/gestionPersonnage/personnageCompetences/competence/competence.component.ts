import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import equal from 'fast-deep-equal';
import {CompetenceService} from '../../../services/competence.service';
import {SpecialResponse} from '../../../loot-table/loot-table.component';

@Component({
    selector: 'app-competence',
    templateUrl: './competence.component.html',
    styleUrls: ['./competence.component.scss']
})
export class CompetenceComponent implements OnInit, OnChanges {

    modificationEnCours = false;
    valide = false;
    idCompetenceContenuModifieEnCours: number = null;

    @Input() competence: Competence;
    competenceOriginal: Competence;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private competenceService: CompetenceService) {
    }

    ngOnInit(): void {
        if (this.competence) {
            this.competenceOriginal = JSON.parse(JSON.stringify(this.competence)) as Competence;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.competence) {
            this.competenceOriginal = JSON.parse(JSON.stringify(this.competence)) as Competence;
        }
    }

    trackByFn(index, item) {
        return index;
    }

    async modifierCompetence() {
        this.modificationEnCours = !this.modificationEnCours;
        if (!this.modificationEnCours) {
            await this.envoyerModification();
        }
    }

    competenceChanged(): boolean {
        return this.areDifferentCompetences(this.competenceOriginal, this.competence);
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

    async envoyerModification() {
        // TODO: envoyer les informations au serveur
        const response: SpecialResponse = await this.competenceService.updateCompetence(this.http, this.competence);
        console.log(response);
        this.competence = response.data as Competence;
    }

    resetCompetence() {
        const comp: Competence = JSON.parse(JSON.stringify(this.competenceOriginal)) as Competence;
        this.competence.icone = comp.icone;
        this.competence.optionnelle = comp.optionnelle;
        this.competence.etat = comp.etat;
        this.competence.niveau = comp.niveau;
        this.competence.titre = comp.titre;
        console.log(this.competence);
        // this.modificationEnCours = false;
    }

    modifierCompetenceContenu(idCompetence: number) {
        this.idCompetenceContenuModifieEnCours = idCompetence;
    }

    async validerModificationCompetenceContenu() {
        try {
            const response: SpecialResponse = await this.competenceService.updateCompetenceContenu(
            this.http, this.competence.contenu.find(f => f.idCompetenceContenu === this.idCompetenceContenuModifieEnCours));
            console.log(response);
            console.log(response.data.contenu);
            console.log(response.data.niveauCompetenceRequis);
        } catch (error) {
            console.log(error);
            this.competence.contenu.find(f => f.idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu =
                this.competenceOriginal.contenu.find(f => f.idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu;
        }
        this.idCompetenceContenuModifieEnCours = null;
    }

    resetCompetenceContenu() {
        this.competence.contenu.find(f => f .idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu =
            this.competenceOriginal.contenu.find(f => f .idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu;
        console.log(this.idCompetenceContenuModifieEnCours);
        console.log(this.competence.contenu.find(f => f .idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu);
        console.log(this.competenceOriginal.contenu.find(f => f .idCompetenceContenu === this.idCompetenceContenuModifieEnCours).contenu);
        this.idCompetenceContenuModifieEnCours = null;
    }

}
