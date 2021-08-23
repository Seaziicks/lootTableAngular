import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PersonnageService} from '../services/personnage.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';
import {MatTable} from '@angular/material/table';
import {HttpMethods} from '../interface/http-methods.enum';
import {FadingInfoComponent} from '../fading-info/fading-info.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as equal from 'fast-deep-equal';

@Component({
    selector: 'app-progression-personnage',
    templateUrl: './progression-personnage.component.html',
    styleUrls: ['./progression-personnage.component.scss']
})
export class ProgressionPersonnageComponent implements OnInit {

    @ViewChild(MatTable) table: MatTable<ProgressionPersonnage>;
    @ViewChild('Banner') banner: FadingInfoComponent;

    progressionPersonnage: ProgressionPersonnage[];
    progressionPersonnageOriginal: ProgressionPersonnage[];
    displayedColumns: string[] = ['niveau', 'statistiques', 'nombreStatistiques', 'pointCompetence', 'nombrePointsCompetences'];

    constructor(private http: HttpClient,
                private personnageService: PersonnageService,
                // tslint:disable-next-line:variable-name
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.loadProgressionPersonnage();
    }

    async loadProgressionPersonnage() {
        this.progressionPersonnage = (await this.personnageService.getProgressionPersonnage(this.http)).data as ProgressionPersonnage[];
        this.progressionPersonnageOriginal = JSON.parse(JSON.stringify(this.progressionPersonnage)) as ProgressionPersonnage[];
    }


    async ajouterLigne() {
        // const lastProgression = this.progressionPersonnage[this.progressionPersonnage.length - 1];
        const lastProgression = this.progressionPersonnage[0];
        const newProgression = {
            idProgressionPersonnage: null, niveau: lastProgression ? lastProgression.niveau + 1 : 1, statistiques: false,
            nombreStatistiques: 0, pointCompetence: false, nombrePointsCompetences: 0
        } as ProgressionPersonnage;
        try {
            const response: SpecialResponse = await this.personnageService.progressionPersonnage(this.http, HttpMethods.POST,
                newProgression.idProgressionPersonnage, newProgression);
            console.log('Je ne suis pas en erreur, donc c\'est bon.');
            console.log(response);
            this.banner.loadComponentFromSpecialResponse(response);
            if (response.status > 199 && response.status < 299) {
                console.log(response.data as ProgressionPersonnage);
                newProgression.idProgressionPersonnage = (response.data as ProgressionPersonnage).idProgressionPersonnage;
                // this.progressionPersonnage.push(newProgression);
                this.progressionPersonnage.unshift(newProgression);
                this.table.renderRows();
            }
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = JSON.parse(error.error) as SpecialResponse;
            console.log(response);
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
            if (response.status === 409) {
                this.openSnackBar('Niveau déjà défini', 'Erreur');
            }
        }
        // console.log(this.progressionPersonnage);
    }

    async supprimerLigne() {
        const progression = this.progressionPersonnage[0];
        try {
            const response = await this.personnageService
                .progressionPersonnage(this.http, HttpMethods.DELETE, progression.idProgressionPersonnage, progression);
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
            if (response.status > 199 && response.status < 299) {
                // this.progressionPersonnage.pop();
                this.progressionPersonnage.shift();
                this.table.renderRows();
            }
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = JSON.parse(error.error) as SpecialResponse;
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
        }
        // console.log(this.progressionPersonnage);
    }

    async validerTable() {
        for (let indexProgression = 0 ; indexProgression < this.progressionPersonnage.length ; indexProgression++) {
            if (!equal(this.progressionPersonnage[indexProgression], this.progressionPersonnageOriginal[indexProgression])) {
                const response: SpecialResponse = await this.personnageService.progressionPersonnage(this.http, HttpMethods.PUT,
                    this.progressionPersonnage[indexProgression].idProgressionPersonnage, this.progressionPersonnage[indexProgression]);
                this.banner.loadComponentFromSpecialResponse(response);
            }
        }
        setTimeout(() => {
            this.loadProgressionPersonnage();
        }, 2500);
    }

    resetTable() {
        this.progressionPersonnage = JSON.parse(JSON.stringify(this.progressionPersonnageOriginal));
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000,
        });
    }

    changementStatistiquesAutorise(indexProgressionPersonnage: number) {
        this.progressionPersonnage[indexProgressionPersonnage].nombreStatistiques =
            this.progressionPersonnage[indexProgressionPersonnage].statistiques ?
                this.progressionPersonnage[indexProgressionPersonnage].nombreStatistiques : 0;
    }

    changementPointCompetenceAutorise(indexProgressionPersonnage: number) {
        this.progressionPersonnage[indexProgressionPersonnage].nombrePointsCompetences =
            this.progressionPersonnage[indexProgressionPersonnage].pointCompetence ?
                this.progressionPersonnage[indexProgressionPersonnage].nombrePointsCompetences : 0;
    }
}

@Component({
    selector: 'app-snack-bar-component',
    template: '<span class="hotPinkColor">\n' +
        '  {{this.message}}' +
        '</span>',
    styles: [`
    /*.hotPinkColor {
      color: hotpink;
    }*/
  `],
})
export class InformationSnackBarComponent {
    @Input() message: string;
}
