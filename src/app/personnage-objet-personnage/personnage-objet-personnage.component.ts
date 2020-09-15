import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../services/objet.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpMethods} from '../interface/http-methods.enum';
import {FadingInfoComponent} from '../fading-info/fading-info.component';

@Component({
  selector: 'app-personnage-objet-personnage',
  templateUrl: './personnage-objet-personnage.component.html',
  styleUrls: ['./personnage-objet-personnage.component.scss']
})
export class PersonnageObjetPersonnageComponent implements OnInit {

    @Input() set idObj(id: number) { this.idObjet = id; this.loadObjet(); }
    @Input() idPersonnage: number;
    @Output() changingObjetEffetDecouvert = new EventEmitter<any>();
    @ViewChild('Banner') banner: FadingInfoComponent;

    idObjet: number;

    objet: ObjetCommunFromDB;
    effetsMagiquesDecouverts: EffetMagiqueDecouvert[];
    effetsMagiquesDecouvertsOriginal: EffetMagiqueDecouvert[];
    modificationsEnCours: boolean[];

    ajoutEffetDecouvert = false;
    effetDecouvertAAjouter: string;

    updating= false;

    constructor(private http: HttpClient,
                private objetService: ObjetService) { }

    ngOnInit(): void {
    }

    loadObjet() {
        this.objetService.getObjetComplet(this.http, this.idObjet).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as ObjetCommunFromDB;
                console.log(this.objet);
                this.loadEffetsMagiquesDecouverts();
            }
        );
    }

    loadEffetsMagiquesDecouverts() {
        this.objetService.getEffetsMagiquesDecouverts(this.http, this.idObjet, this.idPersonnage).then(
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

    ajouterEffetDecouvert() {
        this.ajoutEffetDecouvert = !this.ajoutEffetDecouvert;
    }

    supprimerEffetDecouvert(indexEffetDecouvert: number) {
        this.objetService.effetsMagiquesDecouverts(this.http, HttpMethods.DELETE, this.effetsMagiquesDecouverts[indexEffetDecouvert]).then(
            (data: any) => {
                console.log(data);
                const respone: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(respone.status_message, JSON.stringify(respone.data), '' + respone.status); }, 1250 );
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
                const respone: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(respone.status_message, JSON.stringify(respone.data), '' + respone.status); }, 1250 );
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

    annulerAjoutEffetDecouvert() {
        this.effetDecouvertAAjouter = null;
        this.ajoutEffetDecouvert = false;
    }

    validerAjoutEffetDecouvert() {
        const effetMagiqueDecouvert = {
            idEffetMagiqueDecouvert: null,
            idObjet: this.idObjet,
            idPersonnage: this.idPersonnage,
            effet: this.effetDecouvertAAjouter,
        } as EffetMagiqueDecouvert;
        this.objetService.effetsMagiquesDecouverts(this.http, HttpMethods.POST, effetMagiqueDecouvert).then(
            (data: any) => {
                console.log(data);
                const respone: SpecialResponse = JSON.parse(data) as SpecialResponse;
                setTimeout( () => {
                    this.banner.loadComponent(respone.status_message, JSON.stringify(respone.data), '' + respone.status); }, 1250 );
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
        setTimeout( () => { this.loadEffetsMagiquesDecouverts(); }, 1250 );
        setTimeout( () => {
            this.updating = false;
        }, 2500 );
    }

}
