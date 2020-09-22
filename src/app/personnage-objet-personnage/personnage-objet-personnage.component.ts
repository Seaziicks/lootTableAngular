import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../services/objet.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpMethods} from '../interface/http-methods.enum';
import {FadingInfoComponent} from '../fading-info/fading-info.component';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-personnage-objet-personnage',
  templateUrl: './personnage-objet-personnage.component.html',
  styleUrls: ['./personnage-objet-personnage.component.scss']
})
export class PersonnageObjetPersonnageComponent implements OnInit {

    @Input() set idObj(id: number) { this.idObjet = id; this.loadObjet(); }
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

    loadObjet() {
        this.objetService.getObjetComplet(this.http, this.idObjet).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as ObjetCommunFromDB;
                console.log(this.objet);
                if (this.authService.personnage) {
                    this.loadEffetsMagiquesDecouverts();
                }
            }
        );
    }

    loadEffetsMagiquesDecouverts() {
        this.objetService.getEffetsMagiquesDecouverts(this.http, this.idObjet, this.authService.personnage.idPersonnage).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = data as SpecialResponse;
                this.effetsMagiquesDecouverts = response.data as EffetMagiqueDecouvert[];
                this.effetsMagiquesDecouvertsOriginal = JSON.parse(
                    JSON.stringify(this.effetsMagiquesDecouverts)) as EffetMagiqueDecouvert[];

                this.modificationsEnCours = [];
                for (const effetsMagiquesDecouvert of this.effetsMagiquesDecouverts) {
                    this.modificationsEnCours.push(false);
                }
            }
        );
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

    supprimerEffetDecouvert(indexEffetDecouvert: number) {
        this.objetService.effetsMagiquesDecouverts(this.http, HttpMethods.DELETE, this.effetsMagiquesDecouverts[indexEffetDecouvert]).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status); }, 1250 );
            }
        );
        this.modificationsEnCours[indexEffetDecouvert] = false;

        this.reloadingInterface();
        this.loadEffetsMagiquesDecouverts();
    }

    modifierEffetDecouvert(indexEffetDecouvert: number) {
        this.objetService.effetsMagiquesDecouverts(this.http, HttpMethods.PUT, this.effetsMagiquesDecouverts[indexEffetDecouvert]).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status); }, 1250 );
            }
        );
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

    validerAjoutEffetDecouvert() {
        const effetMagiqueDecouvert = {
            idEffetMagiqueDecouvert: null,
            idObjet: this.idObjet,
            idPersonnage: this.authService.personnage.idPersonnage,
            effet: this.effetDecouvertAAjouter,
        } as EffetMagiqueDecouvert;
        this.objetService.effetsMagiquesDecouverts(this.http, HttpMethods.POST, effetMagiqueDecouvert).then(
            (data: any) => {
                console.log(data);
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status); }, 1250 );
            }
        );
        this.effetDecouvertAAjouter = null;
        this.ajoutEffetDecouvert = false;

        this.reloadingInterface();
        // this.loadEffetsMagiquesDecouverts();
    }

    reloadingInterface() {
        this.updating = true;
        this.changingObjetEffetDecouvert.emit(this.objet.idObjet);
        if (this.authService.personnage) {
            setTimeout(() => { this.loadEffetsMagiquesDecouverts(); }, 1250);
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
        return (this.authService.personnage
            && this.authService.personnage.idPersonnage === this.effetsMagiquesDecouverts[indexEffetMagiqueDecouvert].idPersonnage)
            || this.authService.isGameMaster();
    }

    effetsMagiquesDecouvertsAjoutable(): boolean {
        return !!this.authService.personnage || this.authService.isGameMaster();
    }

    getAutheurEffetMagiqueDecouvert(indexEffetMagiqueDecouvert: number) {
        return this.personnages
            .find(f => f.idPersonnage === this.effetsMagiquesDecouverts[indexEffetMagiqueDecouvert].idPersonnage).nom;
    }

    isGameMaster() {
        return this.authService.isGameMaster();
    }

}
