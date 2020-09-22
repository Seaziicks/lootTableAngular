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
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.loadProgressionPersonnage();
    }

    loadProgressionPersonnage() {
        this.personnageService.getProgressionPersonnage(this.http).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = data as SpecialResponse;
                this.progressionPersonnage = response.data as ProgressionPersonnage[];
                this.progressionPersonnageOriginal = JSON.parse(JSON.stringify(this.progressionPersonnage)) as ProgressionPersonnage[];
                // console.log(this.progressionPersonnage);
            }
        );
    }


    ajouterLigne() {
        const lastProgression = this.progressionPersonnage[this.progressionPersonnage.length - 1];
        const newProgression = {
            idProgressionPersonnage: null, niveau: lastProgression.niveau + 1, statistiques: false,
            nombreStatistiques: 0, pointCompetence: false, nombrePointsCompetences: 0
        } as ProgressionPersonnage;
        this.personnageService.progressionPersonnage(this.http, HttpMethods.POST,
            newProgression.idProgressionPersonnage, newProgression).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
                if (response.status > 199 && response.status < 299) {
                    console.log(response.data as ProgressionPersonnage);
                    newProgression.idProgressionPersonnage = (response.data as ProgressionPersonnage).idProgressionPersonnage;
                    this.progressionPersonnage.push(newProgression);
                    this.table.renderRows();
                } else if (response.status === 409) {
                    this.openSnackBar('Niveau déjà défini', 'Erreur');
                }
            }
        ).catch(
            (data: any) => {
                console.log(data);
                const httpResponse = data;
                const response: SpecialResponse = JSON.parse(data.error) as SpecialResponse;
                this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
                if (httpResponse.status === 409) {
                    this.openSnackBar('Niveau déjà défini', 'Erreur');
                }
            }
        );
        // console.log(this.progressionPersonnage);
    }

    supprimerLigne() {
        const progression = this.progressionPersonnage[this.progressionPersonnage.length - 1];
        this.personnageService.progressionPersonnage(this.http, HttpMethods.DELETE, progression.idProgressionPersonnage, progression).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = JSON.parse(data);
                this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
                if (response.status > 199 && response.status < 299) {
                    this.progressionPersonnage.pop();
                    this.table.renderRows();
                }
            }
        );
        // console.log(this.progressionPersonnage);
    }

    validerTable() {
        for (let indexProgression = 0 ; indexProgression < this.progressionPersonnage.length ; indexProgression++) {
            if (!equal(this.progressionPersonnage[indexProgression], this.progressionPersonnageOriginal[indexProgression])) {
                this.personnageService.progressionPersonnage(this.http, HttpMethods.PUT,
                    this.progressionPersonnage[indexProgression].idProgressionPersonnage, this.progressionPersonnage[indexProgression])
                    .then(
                        (data: any) => {
                            console.log(data);
                            const response: SpecialResponse = JSON.parse(data);
                            this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
                        }
                );
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
    .hotPinkColor {
      color: hotpink;
    }
  `],
})
export class InformationSnackBarComponent {
    @Input() message: string;
}
