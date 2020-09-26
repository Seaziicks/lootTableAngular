import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {FadingInfoComponent} from '../fading-info/fading-info.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {PersonnageService} from '../services/personnage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
    selector: 'app-gestion-niveaux',
    templateUrl: './gestion-niveaux.component.html',
    styleUrls: ['./gestion-niveaux.component.scss']
})
export class GestionNiveauxComponent implements OnInit {

    @ViewChild(MatTable) table: MatTable<ProgressionPersonnage>;
    @ViewChild('Banner') banner: FadingInfoComponent;

    personnages: Personnage[];
    updatingPersonnage = false;
    updatingPersonnageID: number;

    displayedColumns: string[] = ['idPersonnage', 'nom', 'niveau', 'niveauEnAttente', 'deVitaliteNaturelle', 'deManaNaturel', 'monterNiveaux', 'baisserNiveaux'];

    constructor(private http: HttpClient,
                private authService: AuthService,
                private personnageService: PersonnageService,
                private _snackBar: MatSnackBar) {
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

    changerNiveau(idPersonnage: number, monter: boolean) {
        this.personnageService.gererNiveau(this.http, idPersonnage, monter).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = data as SpecialResponse;
                this.banner.loadComponentFromSpecialResponse(response);
                this.reloadPersonnage(idPersonnage);
            }
        );
    }

    reloadPersonnage(idPersonnage: number) {
        this.updatingPersonnage = true;
        this.updatingPersonnageID = idPersonnage;
        setTimeout(() => {
            this.personnageService.getPersonnage(this.http, idPersonnage, false).then(
                (dataPersonnage: any) => {
                    console.log(dataPersonnage);
                    const response: SpecialResponse = dataPersonnage as SpecialResponse;
                    console.log(response);
                    const index = this.personnages.indexOf(this.personnages.find(f => +f.idPersonnage === +idPersonnage));
                    this.personnages[index] = response.data as Personnage;
                    console.log(this.personnages[index]);
                    this.table.renderRows();
                }
            );
        }, 1250);
        setTimeout(() => {
            this.updatingPersonnage = false;
            this.updatingPersonnageID = null;
        }, 2500);
    }

}
