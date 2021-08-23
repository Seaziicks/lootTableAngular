import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {FadingInfoComponent} from '../fading-info/fading-info.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {PersonnageService} from '../services/personnage.service';
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
                /* private _snackBar: MatSnackBar */) {
    }

    async ngOnInit() {
        this.personnages = (await this.personnageService.getAllPersonnages(this.http, true)).data as Personnage[];
    }

    async changerNiveau(idPersonnage: number, monter: boolean) {
        try {
            const response: SpecialResponse = await this.personnageService.gererNiveau(this.http, idPersonnage, monter);
            this.banner.loadComponentFromSpecialResponse(response);
            this.reloadPersonnage(idPersonnage);
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = error.error as SpecialResponse;
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
        }
    }

    reloadPersonnage(idPersonnage: number) {
        this.updatingPersonnage = true;
        this.updatingPersonnageID = idPersonnage;
        setTimeout(async () => {
            const personnage = (await this.personnageService.getPersonnage(this.http, idPersonnage, false)).data as Personnage;
            console.log(personnage);
            const index = this.personnages.indexOf(this.personnages.find(f => +f.idPersonnage === +idPersonnage));
            this.personnages[index] = personnage;
            console.log(this.personnages[index]);
            this.table.renderRows();
        }, 1250);
        setTimeout(() => {
            this.updatingPersonnage = false;
            this.updatingPersonnageID = null;
        }, 2500);
    }

}
