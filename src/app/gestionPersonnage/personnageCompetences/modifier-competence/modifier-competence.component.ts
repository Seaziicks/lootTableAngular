import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonnageService} from '../../../services/personnage.service';
import {AuthService} from '../../../auth/auth.service';
import {SpecialResponse} from '../MyReactComponentWrapper';
import {CompetenceService} from '../../../services/competence.service';

@Component({
    selector: 'app-modifier-competence',
    templateUrl: './modifier-competence.component.html',
    styleUrls: ['./modifier-competence.component.scss']
})
export class ModifierCompetenceComponent implements OnInit {

    @Input() idPersonnage: number;

    competences: Competence[];
    idCompetenceSelectionnee: number;
    competenceSelectionnee: Competence;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private personnageService: PersonnageService,
                private competenceService: CompetenceService) {
    }

    ngOnInit(): void {
        this.personnageService.getCompetences(this.http, this.idPersonnage).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = data as SpecialResponse;
                const competences = response.data as Competence[];
                this.competences = this.competenceService.extractAllCompetences(competences);
                console.log(this.competences);
            }
        );
    }

    selectCompetence() {
        console.log(this.idCompetenceSelectionnee);
        this.competenceSelectionnee = this.competences.find(competence => competence.idCompetence === this.idCompetenceSelectionnee);
        console.log(this.competenceSelectionnee);
    }
}
