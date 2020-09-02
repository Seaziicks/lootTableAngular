import {MagicalProperty, Malediction, SortedMagicalProperty} from '../interface/MonstreGroupe';
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
    prix = 0;
    currencyType = 'po';
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
        this.checkProprietesMagiquesIntegrity();
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

    getMalediction(): Malediction {
        let maledictionToAdd = null;
        if (this.malediction) {
            let descriptionMalediction = '';
            for (const description of this.malediction.description) {
                descriptionMalediction += description;
            }
            maledictionToAdd = {
                idMalediction: null,
                nom: this.malediction.title,
                description: descriptionMalediction,
            } as Malediction;
        }
        return maledictionToAdd;
    }

    checkProprietesMagiquesIntegrity() {
        for (let i = 0 ; i < this.proprietesMagiques.length ; i++) {
            for (let indexDescription = 0 ; indexDescription < this.proprietesMagiques[i].description.length ; indexDescription++) {
                if (this.proprietesMagiques[i].description[indexDescription].length === 0) {
                    this.proprietesMagiques[i].description.splice(indexDescription, 1);
                    indexDescription--;
                }
            }
            if (this.proprietesMagiques[i].table) {
                for (let indexTable = 0; indexTable < this.proprietesMagiques[i].table.length; indexTable++) {
                    for (let indexTableTitle = 0; indexTableTitle <
                    this.proprietesMagiques[i].table[indexTable].title.length; indexTableTitle++) {
                        for (let indexTableTitleContent = 0; indexTableTitleContent <
                        this.proprietesMagiques[i].table[indexTable].title[indexTableTitle].length; indexTableTitleContent++) {
                            if (this.proprietesMagiques[i].table[indexTable].title[indexTableTitle][indexTableTitleContent].length === 0) {
                                this.proprietesMagiques[i].table[indexTable].title[indexTableTitle].splice(indexTableTitleContent, 1);
                                indexTableTitleContent--;
                            }
                        }
                        if (this.proprietesMagiques[i].table[indexTable].title[indexTableTitle].length === 0) {
                            this.proprietesMagiques[i].table[indexTable].title.splice(indexTableTitle, 1);
                            indexTableTitle--;
                        }
                    }
                    for (let indexTableTr = 0; indexTableTr <
                    this.proprietesMagiques[i].table[indexTable].tr.length; indexTableTr++) {
                        for (let indexTableTrContent = 0; indexTableTrContent <
                        this.proprietesMagiques[i].table[indexTable].tr[indexTableTr].length; indexTableTrContent++) {
                            if (this.proprietesMagiques[i].table[indexTable].tr[indexTableTr][indexTableTrContent].length === 0) {
                                this.proprietesMagiques[i].table[indexTable].tr[indexTableTr].splice(indexTableTrContent, 1);
                                indexTableTrContent--;
                            }
                        }
                        if (this.proprietesMagiques[i].table[indexTable].tr[indexTableTr].length === 0) {
                            this.proprietesMagiques[i].table[indexTable].tr.splice(indexTableTr, 1);
                            indexTableTr--;
                        }
                    }
                    if (this.proprietesMagiques[i].table[indexTable].title.length === 0
                        && this.proprietesMagiques[i].table[indexTable].tr.length === 0) {
                        this.proprietesMagiques[i].table.splice(indexTable, 1);
                        indexTable--;
                    }
                }
            }
            if (this.proprietesMagiques[i].ul) {
                for (let indexUl = 0; indexUl < this.proprietesMagiques[i].ul.length; indexUl++) {
                    for (let indexLi = 0; indexLi < this.proprietesMagiques[i].ul[indexUl].li.length; indexLi++) {
                        if (this.proprietesMagiques[i].ul[indexUl].li[indexLi].length === 0) {
                            this.proprietesMagiques[i].ul[indexUl].li.splice(indexLi, 1);
                            indexLi--;
                        }
                    }
                    if (this.proprietesMagiques[i].ul.length === 0) {
                        this.proprietesMagiques[i].ul.splice(indexUl, 1);
                        indexUl--;
                    }
                }
            }

            if (this.proprietesMagiques[i].description.length === 0
                && !this.proprietesMagiques[i].table
                && !this.proprietesMagiques[i].ul) {
                console.log('Suppression de la propriete magique :' + this.proprietesMagiques[i].title);
                this.proprietesMagiques.splice(i, 1);
                i--;
            }
        }
    }

    abstract castToObjetCommunDB();

    abstract setNom();
}

