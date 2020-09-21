import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {JSonLoadService} from '../../services/json-load.service';
import {MaledictionsComponent} from '../maledictions/maledictions.component';
import {ObjetCommun} from '../objet-commun';

@Component({
    selector: 'app-objet-simple',
    templateUrl: './objet-simple.component.html',
    styleUrls: ['./objet-simple.component.scss']
})
export class ObjetSimpleComponent extends ObjetCommun implements OnInit {

    @Output() objetSimpleEventEmitter = new EventEmitter<ObjetSimpleComponent>();
    @ViewChild('maledictionsComponent') maledictionComponent: MaledictionsComponent;
    @Input() maudit: boolean;

    @Input() parametres: string[];

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
    }

    ngOnInit(): void {
        this.jsonService.getJSON(this.parametres[3], this.parametres[4]).then(
            (effetsObjet: any) => {
                // console.log(effetsObjet);
                this.allProprietesMagiques = JSON.parse(effetsObjet) as SortedMagicalProperty;
                // console.log(JSON.parse(effetsObjet).strongAnfPowerful[9]);
                // console.log(this.allObjets.strongAnfPowerful[9]);
            }
        );
        this.type = this.parametres[2];
        this.getArrayPourNbProprieteMagique();
    }

    loadComplete(): boolean {
        if (this.maudit) {
            return !!this.allProprietesMagiques && this.maledictionComponent.loadComplete();
        } else {
            return !!this.allProprietesMagiques;
        }
    }

    reset() {
        this.proprietesMagiques = [];
        this.nom = undefined;
        // this.prix = 0;
    }

    setNom() {
        if (this.proprietesMagiques.length > 0) {
            this.nom = this.parametres[2] + ' ' + this.getNomsProprieteMagique();
        } else {
            this.nom = this.parametres[2];
        }
        // console.log(this.nom);
    }

    setBonus(data: string[]) {
        this.bonus = null;
    }

    selection() {
        super.selection();
        this.objetSimpleEventEmitter.emit(this);
    }

    deselection() {
        this.valide = false;
        this.objetSimpleEventEmitter.emit(null);
    }

    castToObjetCommunForDB(idPersonnageSelectionnee: number = 0): ObjetCommunForDB {
        const maledictionToAdd = this.getMalediction();
        let values: ObjetCommunForDB;
        console.log(this.prix);
        console.log(this.proprietesMagiques);
        values = {
            idObjet: null,
            idPersonnage: idPersonnageSelectionnee,
            nom: this.nom,
            fauxNom: this.fauxNom,
            bonus: this.bonus,
            type: this.type,
            prix: this.prix + this.prixProprieteMagique,
            prixNonHumanoide: null,
            devise: this.currencyType,
            proprieteMagique: this.proprietesMagiques,
            malediction: maledictionToAdd,
            categorie: null,
            materiau: null,
            taille: null,
            degats: null,
            critique: null,
            facteurPortee: null,
            armure: null,
            bonusDexteriteMax: null,
            malusArmureTests: null,
            risqueEchecSorts: null,
            afficherNom: this.afficherNom,
            afficherEffetMagique: this.afficherEffetMagique,
            afficherMalediction: this.afficherMalediction,
            afficherMateriau: this.afficherMateriau,
            afficherInfos: this.afficherInfos,
        } as ObjetCommunForDB;

        return values;
    }
}
