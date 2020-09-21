import {Component, OnInit, ViewChild} from '@angular/core';
import {PersonnageService} from '../services/personnage.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';
import {MatTable} from '@angular/material/table';

@Component({
    selector: 'app-progression-personnage',
    templateUrl: './progression-personnage.component.html',
    styleUrls: ['./progression-personnage.component.scss']
})
export class ProgressionPersonnageComponent implements OnInit {

    @ViewChild(MatTable) table: MatTable<ProgressionPersonnage>;

    progressionPersonnage: ProgressionPersonnage[];
    progressionPersonnageOriginal: ProgressionPersonnage[];
    displayedColumns: string[] = ['niveau', 'statistiques', 'nombreStatistiques', 'pointCompetence', 'nombrePointsCompetences'];

    constructor(private http: HttpClient, private personnageService: PersonnageService) {
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
        this.progressionPersonnage.push({
            idProgressionPersonnage: null, niveau: lastProgression.niveau + 1, statistiques: false,
            nombreStatistiques: 0, pointCompetence: false, nombrePointsCompetences: 0
        } as ProgressionPersonnage);
        this.table.renderRows();
        // console.log(this.progressionPersonnage);
    }

    supprimerLigne() {
        this.progressionPersonnage.pop();
        this.table.renderRows();
        // console.log(this.progressionPersonnage);
    }

    validerTable() {
        // TODO: Valider la table
    }

    resetTable() {
        this.progressionPersonnage = JSON.parse(JSON.stringify(this.progressionPersonnageOriginal));
    }

}
