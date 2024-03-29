import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../../services/objet.service';
import {SpecialResponse} from '../../loot-table/loot-table.component';
import {HttpMethods} from '../../interface/http-methods.enum';
import {FadingInfoComponent} from '../../fading-info/fading-info.component';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-personnage-objet-personnage',
  templateUrl: './personnage-objet-personnage.component.html',
  styleUrls: ['./personnage-objet-personnage.component.scss']
})
export class PersonnageObjetPersonnageComponent implements OnInit {

    @Input() set idObj(id: number) { this.idObjet = id; this.loadObjet().then(); }
    @Input() idPersonnage: number;
    @Input() personnages: Personnage[];
    @Output() changingObjetEffetDecouvert = new EventEmitter<any>();
    @ViewChild('Banner') banner: FadingInfoComponent;

    idObjet: number;

    objet: ObjetCommunFromDB;
    effetsMagiquesDecouverts: EffetMagiqueDecouvert[];
    effetsMagiquesDecouvertsOriginal: EffetMagiqueDecouvert[];
    modificationsEnCours: boolean[];

    ajoutEffetDecouvert = false;
    effetDecouvertAAjouter: string;

    updating = false;

    constructor(private http: HttpClient,
                private objetService: ObjetService,
                private authService: AuthService) { }

    ngOnInit(): void {
    }

    async loadObjet() {
        const response: SpecialResponse = await this.objetService.getObjetComplet(this.http, this.idObjet);
        console.log(response);
        this.objet = response.data as ObjetCommunFromDB;
        console.log(this.objet);
        if (this.authService.getPersonnage()) {
            await this.loadEffetsMagiquesDecouverts();
        }
    }

    async loadEffetsMagiquesDecouverts() {
        const response: SpecialResponse = await this.objetService
            .getEffetsMagiquesDecouverts(this.http, this.idObjet, this.authService.getPersonnage().idPersonnage);
        console.log(response);
        this.effetsMagiquesDecouverts = response.data as EffetMagiqueDecouvert[];
        this.effetsMagiquesDecouvertsOriginal = JSON.parse(
            JSON.stringify(this.effetsMagiquesDecouverts)) as EffetMagiqueDecouvert[];

        this.modificationsEnCours = [];
        for (const effetsMagiquesDecouvert of this.effetsMagiquesDecouverts) {
            this.modificationsEnCours.push(false);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && event.ctrlKey) {
            // TODO : Gérer la modification d'un effet magique découvert
        }
    }

    aModificationIsOccuring(): boolean {
        return this.getModificationIndex() !== -1;
    }

    getModificationIndex(): number {
        return this.modificationsEnCours.indexOf(this.modificationsEnCours.find(f => f === true));
    }

    trackByFn(index, item) {
        return index;
    }

    async supprimerEffetDecouvert(indexEffetDecouvert: number) {
        const response: SpecialResponse = await this.objetService
            .effetsMagiquesDecouverts(this.http, HttpMethods.DELETE, this.effetsMagiquesDecouverts[indexEffetDecouvert]);
        console.log(response);
        setTimeout( () => {
            this.banner.loadComponentFromSpecialResponse(response); }, 1250 );

        this.modificationsEnCours[indexEffetDecouvert] = false;

        this.reloadingInterface();
        await this.loadEffetsMagiquesDecouverts();
    }

    async modifierEffetDecouvert(indexEffetDecouvert: number) {
        const response: SpecialResponse = await this.objetService
            .effetsMagiquesDecouverts(this.http, HttpMethods.PUT, this.effetsMagiquesDecouverts[indexEffetDecouvert]);
        console.log(response);
        setTimeout( () => {
            this.banner.loadComponentFromSpecialResponse(response); }, 1250 );

        this.modificationsEnCours[indexEffetDecouvert] = false;

        this.reloadingInterface();
        // this.loadEffetsMagiquesDecouverts();
    }

    annulerModificationEffetDecouvert(indexEffetDecouvert: number) {
        this.effetsMagiquesDecouverts[indexEffetDecouvert].effet = this.effetsMagiquesDecouvertsOriginal[indexEffetDecouvert].effet;
        this.modificationsEnCours[indexEffetDecouvert] = false;
    }

    ajouterEffetDecouvert() {
        this.fermerModificationCourante();
        this.ajoutEffetDecouvert = !this.ajoutEffetDecouvert;
    }

    annulerAjoutEffetDecouvert() {
        this.effetDecouvertAAjouter = null;
        this.ajoutEffetDecouvert = false;
    }

    async validerAjoutEffetDecouvert() {
        const effetMagiqueDecouvert = {
            idEffetMagiqueDecouvert: null,
            idObjet: this.idObjet,
            idPersonnage: this.authService.getPersonnage().idPersonnage,
            effet: this.effetDecouvertAAjouter,
        } as EffetMagiqueDecouvert;
        const response: SpecialResponse = await this.objetService
            .effetsMagiquesDecouverts(this.http, HttpMethods.POST, effetMagiqueDecouvert);
        console.log(response);
        setTimeout( () => {
            this.banner.loadComponentFromSpecialResponse(response); }, 1250 );

        this.effetDecouvertAAjouter = null;
        this.ajoutEffetDecouvert = false;

        this.reloadingInterface();
        // this.loadEffetsMagiquesDecouverts();
    }

    reloadingInterface() {
        this.updating = true;
        this.changingObjetEffetDecouvert.emit(this.objet.idObjet);
        if (this.authService.getPersonnage()) {
            setTimeout(async () => { await this.loadEffetsMagiquesDecouverts(); }, 1250);
        }
        setTimeout( () => {
            this.updating = false;
        }, 2500 );
    }

    lancerModification(indexEffetMagiqueDecouvert: number) {
        this.fermerModificationCourante();
        this.annulerAjoutEffetDecouvert();
        this.modificationsEnCours[indexEffetMagiqueDecouvert] = true;
    }

    fermerModificationCourante() {
        if (this.aModificationIsOccuring()) {
            this.annulerModificationEffetDecouvert(this.getModificationIndex());
        }
    }

    effetsMagiquesDecouvertsAffichables(indexEffetMagiqueDecouvert: number): boolean {
        return (this.authService.getPersonnage()
            && this.authService.getPersonnage().idPersonnage === this.effetsMagiquesDecouverts[indexEffetMagiqueDecouvert].idPersonnage)
            || this.authService.isGameMaster();
    }

    effetsMagiquesDecouvertsAjoutable(): boolean {
        return !!this.authService.getPersonnage() || this.authService.isGameMaster();
    }

    getAutheurEffetMagiqueDecouvert(indexEffetMagiqueDecouvert: number) {
        return this.personnages
            .find(f => f.idPersonnage === this.effetsMagiquesDecouverts[indexEffetMagiqueDecouvert].idPersonnage).nom;
    }

    isGameMaster() {
        return this.authService.isGameMaster();
    }

}
