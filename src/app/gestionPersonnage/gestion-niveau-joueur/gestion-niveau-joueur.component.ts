import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {FadingInfoComponent} from '../../fading-info/fading-info.component';
import {HttpClient} from '@angular/common/http';
import {PersonnageService} from '../../services/personnage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialResponse} from '../../loot-table/loot-table.component';
import {HttpMethods} from '../../interface/http-methods.enum';
import * as equal from 'fast-deep-equal';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-gestion-niveau-joueur',
  templateUrl: './gestion-niveau-joueur.component.html',
  styleUrls: ['./gestion-niveau-joueur.component.scss']
})
export class GestionNiveauJoueurComponent implements OnInit {

    @ViewChild(MatTable) table: MatTable<ProgressionPersonnage>;
    @ViewChild('Banner') banner: FadingInfoComponent;

    progressionsPersonnage: ProgressionPersonnage[];
    progressionsPersonnageOriginal: ProgressionPersonnage[];
    statistiquesPersonnage: StatistiquesParNiveau[];
    statistiquesPersonnageOriginal: StatistiquesParNiveau[];
    nouveauNiveau: StatistiquesParNiveau;
    niveauEnAttente: ProgressionPersonnage;

    pointsDispos = 0;

    personnage: Personnage;


    idPersonnage: number;

    displayedColumns: string[] = ['niveau', 'intelligence', 'force', 'agilité', 'sagesse', 'constitution', 'vitalité', 'vitalité naturelle',
        'dé vitalité', 'mana', 'mana naturel', 'dé mana'];

    constructor(private http: HttpClient,
                private authService: AuthService,
                private personnageService: PersonnageService,
                // tslint:disable-next-line:variable-name
                private _snackBar: MatSnackBar,
                private router: Router,
                private route: ActivatedRoute) {
    }

    async ngOnInit() {
        // await this.authService.checkUserInLocalStorage(this.router); A supprimer. Normalement Jwt maintenant.
        this.authService.checkJwtInLocalStorage();
        console.log('caca');
        console.log(this.route.snapshot.paramMap.get('idPersonnage'));
        console.log(this.authService.isGameMaster());
        console.log(this.authService.user);
        if (this.authService.getPersonnage()) {
            console.log('ici');
            this.idPersonnage = this.authService.getPersonnage().idPersonnage;
        } else if (this.authService.isGameMaster()) {
            console.log('là');
            this.idPersonnage = +this.route.snapshot.paramMap.get('idPersonnage');
        } else {
            console.log('là bas');
            await this.router.navigate(['/']);
        }
        this.nouveauNiveau = {
            niveau: 0,
            intelligence: 0,
            force: 0,
            agilite: 0,
            sagesse: 0,
            constitution: 0,
            vitalite: 0,
            vitaliteNaturelle: 0,
            deVitalite: 0,
            mana: 0,
            manaNaturel: 0,
            deMana: 0,
        } as StatistiquesParNiveau;
        if (this.idPersonnage) {
            await this.loadProgressionPersonnage();
            await this.loadPersonnage();
        }
    }

    async loadPersonnage() {
        this.personnage = (await this.personnageService.getPersonnage(this.http, this.idPersonnage, true)).data as Personnage;
        this.triggerVitaliteNaturelle();
        this.nouveauNiveau.niveau = this.personnage.niveau + 1;
        if (this.personnage.niveauEnAttente) {
            this.niveauEnAttente = (await this.personnageService.getNiveauEnAttente(this.http, this.personnage.niveau + 1))
                .data as ProgressionPersonnage;
            if (this.niveauEnAttente.statistiques) {
                this.pointsDispos = this.niveauEnAttente.nombreStatistiques;
            } else {
                this.pointsDispos = 0;
            }
        } else {
            this.pointsDispos = 0;
        }
    }

    async loadProgressionPersonnage() {
        this.statistiquesPersonnage = (await this.personnageService.getStatistiquesDetaillees(this.http, this.idPersonnage, true))
            .data as StatistiquesParNiveau[];
        this.statistiquesPersonnageOriginal = JSON.parse(JSON.stringify(this.statistiquesPersonnage)) as StatistiquesParNiveau[];
    }


    async ajouterLigne() {
        const lastProgression = this.progressionsPersonnage[this.progressionsPersonnage.length - 1];
        const newProgression = {
            idProgressionPersonnage: null, niveau: lastProgression.niveau + 1, statistiques: false,
            nombreStatistiques: 0, pointCompetence: false, nombrePointsCompetences: 0
        } as ProgressionPersonnage;
        try {
            const response = await this.personnageService.progressionPersonnage(this.http, HttpMethods.POST,
                newProgression.idProgressionPersonnage, newProgression);
            this.banner.loadComponentFromSpecialResponse(response);
            if (response.status > 199 && response.status < 299) {
                console.log(response.data as ProgressionPersonnage);
                newProgression.idProgressionPersonnage = (response.data as ProgressionPersonnage).idProgressionPersonnage;
                this.progressionsPersonnage.push(newProgression);
                this.table.renderRows();
            }
        } catch (error) {
            console.log(error);
            const response: SpecialResponse = error.error as SpecialResponse;
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
            if (response.status === 409) {
                this.openSnackBar('Niveau déjà défini', 'Erreur');
            }
        }
        // console.log(this.progressionPersonnage);
    }

    async supprimerLigne() {
        const progression = this.progressionsPersonnage[this.progressionsPersonnage.length - 1];
        // tslint:disable-next-line:max-line-length
        const response = await this.personnageService.progressionPersonnage(this.http, HttpMethods.DELETE, progression.idProgressionPersonnage, progression);
        this.banner.loadComponentFromSpecialResponse(response);
        if (response.status > 199 && response.status < 299) {
            this.progressionsPersonnage.pop();
            this.table.renderRows();
        }
        // console.log(this.progressionPersonnage);
    }

    async validerTable() {
        for (let indexProgression = 0 ; indexProgression < this.progressionsPersonnage.length ; indexProgression++) {
            if (!equal(this.progressionsPersonnage[indexProgression], this.progressionsPersonnageOriginal[indexProgression])) {
                const response = await this.personnageService.progressionPersonnage(this.http, HttpMethods.PUT,
                    this.progressionsPersonnage[indexProgression].idProgressionPersonnage, this.progressionsPersonnage[indexProgression]);
                this.banner.loadComponentFromSpecialResponse(response);
            }
        }
        setTimeout(() => {
            this.loadProgressionPersonnage();
        }, 2500);
    }

    resetTable() {
        this.progressionsPersonnage = JSON.parse(JSON.stringify(this.progressionsPersonnageOriginal));
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 9000,
        });
    }

    changementStatistiquesAutorise(indexProgressionPersonnage: number) {
        this.progressionsPersonnage[indexProgressionPersonnage].nombreStatistiques =
            this.progressionsPersonnage[indexProgressionPersonnage].statistiques ?
                this.progressionsPersonnage[indexProgressionPersonnage].nombreStatistiques : 0;
    }

    changementPointCompetenceAutorise(indexProgressionPersonnage: number) {
        this.progressionsPersonnage[indexProgressionPersonnage].nombrePointsCompetences =
            this.progressionsPersonnage[indexProgressionPersonnage].pointCompetence ?
                this.progressionsPersonnage[indexProgressionPersonnage].nombrePointsCompetences : 0;
    }

    triggerVitaliteNaturelle() {
        this.nouveauNiveau.vitaliteNaturelle = Math.max(0,
            Math.floor((this.personnage.constitution + this.nouveauNiveau.constitution - 10) / 2));
    }

    pointStatistiqueUtilises(): number {
        const niv = this.nouveauNiveau;
        return niv.intelligence + niv.force + niv.agilite + niv.constitution + niv.sagesse + niv.vitalite + niv.mana;
    }

    pointStatistiqueRestant(): boolean {
        return this.pointStatistiqueUtilises() < this.pointsDispos;
    }

    nbPointStatistiqueRestant(): number {
        return this.pointsDispos - this.pointStatistiqueUtilises();
    }

    pntStatDispo(statistique: string): number {
        switch (statistique) {
            case 'intelligence':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.intelligence;
            case 'force':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.force;
            case 'agilite':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.agilite;
            case 'constitution':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.constitution;
            case 'sagesse':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.sagesse;
            case 'vitalite':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.vitalite;
            case 'mana':
                return +this.nbPointStatistiqueRestant() + this.nouveauNiveau.mana;
            default:
                return 0;
        }
    }

    isValide(statistique: string): boolean {
        switch (statistique) {
            case 'intelligence':
                return this.nouveauNiveau.intelligence > 0 || this.pointStatistiqueRestant();
            case 'force':
                return this.nouveauNiveau.force > 0 || this.pointStatistiqueRestant();
            case 'agilite':
                return this.nouveauNiveau.agilite > 0 || this.pointStatistiqueRestant();
            case 'constitution':
                return this.nouveauNiveau.constitution > 0 || this.pointStatistiqueRestant();
            case 'sagesse':
                return this.nouveauNiveau.sagesse > 0 || this.pointStatistiqueRestant();
            case 'vitalite':
                return this.nouveauNiveau.vitalite > 0 || this.pointStatistiqueRestant();
            case 'mana':
                return this.nouveauNiveau.mana > 0 || this.pointStatistiqueRestant();
            default:
                return false;
        }
    }

    augmenterStatistique(statistique: string) {
        switch (statistique) {
            case 'intelligence':
                this.nouveauNiveau.intelligence += 1;
                break;
            case 'force':
                this.nouveauNiveau.force += 1;
                break;
            case 'agilite':
                this.nouveauNiveau.agilite += 1;
                break;
            case 'constitution':
                this.nouveauNiveau.constitution += 1;
                break;
            case 'sagesse':
                this.nouveauNiveau.sagesse += 1;
                break;
            case 'vitalite':
                this.nouveauNiveau.vitalite += 1;
                break;
            case 'mana':
                this.nouveauNiveau.mana += 1;
                break;
        }
    }

    diminuerStatistique(statistique: string) {
        switch (statistique) {
            case 'intelligence':
                this.nouveauNiveau.intelligence -= 1;
                break;
            case 'force':
                this.nouveauNiveau.force -= 1;
                break;
            case 'agilite':
                this.nouveauNiveau.agilite -= 1;
                break;
            case 'constitution':
                this.nouveauNiveau.constitution -= 1;
                break;
            case 'sagesse':
                this.nouveauNiveau.sagesse -= 1;
                break;
            case 'vitalite':
                this.nouveauNiveau.vitalite -= 1;
                break;
            case 'mana':
                this.nouveauNiveau.mana -= 1;
                break;
        }
    }

    checkDeVitalite(event: any) {
        console.log(this.personnage.deVitaliteNaturelle);
        if (+event.target.value > this.personnage.deVitaliteNaturelle) {
            event.target.value = +this.personnage.deVitaliteNaturelle;
        } else if (+event.target.value < 0) {
            event.target.value = 0;
        } else if (isNaN(event.target.value)) {
            event.target.value = null;
            this.nouveauNiveau.deVitalite = null;
        }
    }

    checkDeMana(event: any) {
        if (+event.target.value > this.personnage.deManaNaturel) {
            event.target.value = +this.personnage.deManaNaturel;
        } else if (+event.target.value < 0) {
            event.target.value = 0;
        } else if (isNaN(event.target.value)) {
            event.target.value = null;
            this.nouveauNiveau.deMana = null;
        }
    }

    isNiveauValidable() {
        return !this.pointStatistiqueRestant()
            && ((this.personnage.deVitaliteNaturelle > 0 && this.nouveauNiveau.deVitalite > 0) || this.personnage.deVitaliteNaturelle === 0)
            && ((this.personnage.deManaNaturel > 0 && this.nouveauNiveau.deMana > 0) || this.personnage.deManaNaturel === 0);
    }

    async validerNiveau() {
        try {
            const response: SpecialResponse = await this.personnageService
                .monterNiveau(this.http, HttpMethods.POST, this.personnage.idPersonnage, this.nouveauNiveau);
            // const niveau: StatistiquesParNiveau = response.data as StatistiquesParNiveau;
            this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
            /*
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['Your actualComponent']);
            });
            */
            this.nouveauNiveau = {
                niveau: 0,
                intelligence: 0,
                force: 0,
                agilite: 0,
                sagesse: 0,
                constitution: 0,
                vitalite: 0,
                vitaliteNaturelle: 0,
                deVitalite: 0,
                mana: 0,
                manaNaturel: 0,
                deMana: 0,
            } as StatistiquesParNiveau;
            await this.loadPersonnage();
            await this.loadProgressionPersonnage();
        } catch (error) {
                console.log(error);
                const httpResponse = error.error;
                const response: SpecialResponse = JSON.parse(httpResponse) as SpecialResponse;
                this.banner.loadComponentFromSpecialResponseWithoutTitle(response);
                if (response.status === 403) {
                    this.openSnackBar('Montée de niveau non autorisée.', 'Erreur');
                } else if (response.status === 451) {
                    this.openSnackBar('Mauvais niveau.', 'Erreur');
                } else if (response.status === 406) {
                    this.openSnackBar('Pris la main dans le sac !', 'Erreur');
                } else if (response.status === 400) {
                    this.openSnackBar('Erreur d\'argument ou SQL', 'Erreur');
                } else {
                    this.openSnackBar('Erreur inconnue', 'Erreur');
                }
            }
    }
}
