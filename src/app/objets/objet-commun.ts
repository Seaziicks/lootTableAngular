import {MagicalProperty, SortedMagicalProperty} from '../interface/MonstreGroupe';
import {JSonLoadService} from '../services/json-load.service';
import {EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MaledictionsComponent} from './maledictions/maledictions.component';
import {ObjetSimpleComponent} from './objet-simple/objet-simple.component';

export abstract class ObjetCommun {

    maledictionComponent: MaledictionsComponent;
    maudit: boolean;

    nom: string;
    bonus: number;
    type: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;
    currencyType: string;
    prixProprieteMagique: number;
    proprieteMagiqueCurrencyType: string;

    dePuissance: number;
    deProprieteMagique: number;

    allProprietesMagiques: SortedMagicalProperty;

    modificationEnCours = false;

    malediction: MagicalProperty;

    valide = false;

    constructor(jsonService: JSonLoadService) {
    }

    resetContenu() {
        this.getProprieteMagique();
        this.setNom();
        this.modificationEnCours = false;
    }

    trackByFn(index, item) {
        return index;
    }

    selectionMalediction($event: MagicalProperty) {
        this.malediction = $event;
        // console.log(this.malediction);
    }

    modifierContenu() {
        this.modificationEnCours = !this.modificationEnCours;
    }

    getProprietesMagiques(proprietesMagiques: SortedMagicalProperty) {
        return this.dePuissance === 1 ? proprietesMagiques.weakAndSmall.concat(proprietesMagiques.unknown)
            : this.dePuissance === 2 ? proprietesMagiques.moderate.concat(proprietesMagiques.unknown)
                : this.dePuissance === 3 ? proprietesMagiques.strongAnfPowerful.concat(proprietesMagiques.unknown) :
                    null;
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        if (this.dePuissance && this.deProprieteMagique
            && this.deProprieteMagique <= this.getNbProprietesMagiques(this.allProprietesMagiques)) {
            this.proprietesMagiques.push(
                JSON.parse(JSON.stringify(
                    this.getProprietesMagiques(this.allProprietesMagiques)[this.deProprieteMagique - 1])) as MagicalProperty);
            this.setNom();
            this.getPrixAndCurrency();
        }
    }

    getNbProprietesMagiques(proprietesMagiques: SortedMagicalProperty): number {
        return this.getProprietesMagiques(proprietesMagiques).length;
    }

    getPrixAndCurrency() {
        this.prixProprieteMagique = 0;
        this.proprieteMagiqueCurrencyType = null;
        for (const proprieteMagique of this.proprietesMagiques) {
            const data = proprieteMagique.infos.data;
            const indexPrix = data.indexOf(data.filter(f => f.includes('Prix'))[0]);
            if (!data[indexPrix].includes('bonus')) {
                const match = data[indexPrix].match(/([0-9]+ )+/)[0];
                this.prixProprieteMagique = +match.replace(' ', '').replace(' ', '');
                const matchCurrency = data[indexPrix].substring(data[indexPrix].indexOf(match)).match(/[a-z]+[ |\.]/)[0];
                this.proprieteMagiqueCurrencyType = matchCurrency.replace(match, '')
                    .replace(' ', '').replace('.', '');
            }
        }
    }

    abstract setNom();
}

