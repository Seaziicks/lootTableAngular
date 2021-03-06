import {JSonLoadService} from '../services/json-load.service';
import {MaledictionsComponent} from './maledictions/maledictions.component';
import {Component, Injectable, Input} from '@angular/core';

@Injectable()
export abstract class ObjetCommun {

    maledictionComponent: MaledictionsComponent;
    maudit: boolean;

    nom: string;
    fauxNom: string;
    bonus: number;
    type: string;
    proprietesMagiques: MagicalProperty[] = [];
    proprietesMagiquesFakes: MagicalProperty[];
    prix = 0;
    currencyType = 'po';
    prixProprieteMagique: number;
    proprieteMagiqueCurrencyType: string;

    dePuissance: number;
    deProprieteMagique: number;
    deNombreProprietesMagiques = 1;

    allProprietesMagiques: SortedMagicalProperty;

    modificationEnCours = false;

    malediction: MagicalProperty;

    valide = false;

    afficherNom = false;
    afficherEffetMagique = false;
    afficherMalediction = false;
    afficherMateriau = false;
    afficherInfos = false;

    protected constructor(jsonService: JSonLoadService) {
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
            console.log(proprieteMagique);
            const data = proprieteMagique.infos.data;
            const indexPrix = data.indexOf(data.filter(f => f.includes('Prix'))[0]);
            if (indexPrix !== -1 && !data[indexPrix].includes('bonus')) {
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

    abstract castToObjetCommunForDB(idPersonnageSelectionnee: number);

    abstract setNom();

    changeValidation(name: string) {
        switch (name.toLowerCase()) {
            case 'nom':
                this.afficherNom = !this.afficherNom;
                break;
            case 'effetmagique':
                this.afficherEffetMagique = !this.afficherEffetMagique;
                break;
            case 'malediction':
                this.afficherMalediction = !this.afficherMalediction;
                break;
            case 'materiau':
                this.afficherMateriau = !this.afficherMateriau;
                break;
            case 'infos':
                this.afficherInfos = !this.afficherInfos;
                break;

        }
    }

    getArrayPourNbProprieteMagique() {
        this.proprietesMagiquesFakes = [];
        this.proprietesMagiquesFakes = [].constructor(this.deNombreProprietesMagiques);
    }

    objetValidable() {
        return this.fauxNom || this.afficherNom;
    }

    creationProprieteMagique(indexProprieteMagique) {
        if (!(this.proprietesMagiques.length === indexProprieteMagique)) {
            throw new Error('Incohérence dans les propriétés magiques, dans leurs nombres. Il y aurait du en avoir ' + indexProprieteMagique
                + ', mais il y en a  ' + this.proprietesMagiques.length  + '.');
        }
        this.proprietesMagiques.push(null);
        console.log('Création d\'une propriété magique, il y en a maintent : ' + this.proprietesMagiques.length);
    }

    changeProprieteMagique($event) {
        console.log($event.proprieteMagique);
        console.log($event.indexProprieteMagique);
        this.proprietesMagiques[$event.indexProprieteMagique] = $event.proprieteMagique;
        console.log(this.proprietesMagiques[$event.indexProprieteMagique] = $event.proprieteMagique);
        this.setNom();
    }

    getNomsProprieteMagique(): string {
        // console.log(this.proprietesMagiques.length);
        let nomProprietesMagiques = '';
        for (const propriete of this.proprietesMagiques) {
            if (propriete && propriete.title) {
                if (nomProprietesMagiques.length > 0) {
                    nomProprietesMagiques += ' & ' + propriete.title;
                } else {
                    nomProprietesMagiques += propriete.title;
                }
            }
        }
        return nomProprietesMagiques;
    }

    selection() {
        this.valide = true;
        this.setNom();
        this.getPrixAndCurrency();
    }
}

