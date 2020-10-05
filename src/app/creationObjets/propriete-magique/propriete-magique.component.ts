import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-propriete-magique',
    templateUrl: './propriete-magique.component.html',
    styleUrls: ['./propriete-magique.component.scss']
})
export class ProprieteMagiqueComponent implements OnInit {

    @Input() allProprietesMagiques: SortedMagicalProperty;
    @Input() indexProprieteMagique: number;
    @Input() nom: string;
    @Input() dePuissanceSpecial: number;
    proprieteMagique: MagicalProperty;
    proprieteMagiqueOriginal: MagicalProperty;
    @Output() creationProprieteMagiqueEventEmitter = new EventEmitter<number>();
    @Output() proprieteMagiqueEventEmitter = new EventEmitter<{proprieteMagique: MagicalProperty, indexProprieteMagique: number}>();
    @Output() resetProprieteMagiqueEventEmitter = new EventEmitter<number>();

    modificationEnCours = false;

    valide = false;

    dePuissance: number;
    deProprieteMagique: number;

    prixProprieteMagique: number;
    proprieteMagiqueCurrencyType: string;

    constructor() {
    }

    ngOnInit(): void {
        // this.proprieteMagiqueOriginal = JSON.parse(JSON.stringify(this.proprieteMagique)) as MagicalProperty;
        this.creationProprieteMagiqueEventEmitter.emit(this.indexProprieteMagique);
        console.log(this.dePuissanceSpecial);
        if (this.dePuissanceSpecial) {
            this.dePuissance = this.dePuissanceSpecial;
        }
    }

    trackByFn(index, item) {
        return index;
    }

    getNomsProprieteMagique(): string {
        return this.proprieteMagique.title;
    }

    modifierContenu() {
        this.modificationEnCours = !this.modificationEnCours;
        this.checkProprietesMagiquesIntegrity();
        if (!this.modificationEnCours) {
            this.proprieteMagiqueEventEmitter
                .emit({ proprieteMagique: this.proprieteMagique, indexProprieteMagique: this.indexProprieteMagique});
        }
    }

    selection() {
        this.valide = true;
        this.proprieteMagiqueEventEmitter
            .emit({ proprieteMagique: this.proprieteMagique, indexProprieteMagique: this.indexProprieteMagique});
    }

    deselection() {
        this.valide = false;
        this.proprieteMagiqueEventEmitter.emit({proprieteMagique: null, indexProprieteMagique: null});
    }

    resetContenu() {
        this.resetProprieteMagique();
        this.modificationEnCours = false;
    }

    resetProprieteMagique() {
        this.proprieteMagique = JSON.parse(JSON.stringify(this.proprieteMagiqueOriginal)) as MagicalProperty;
        console.log(this.proprieteMagiqueOriginal);
        this.proprieteMagiqueEventEmitter
            .emit({ proprieteMagique: this.proprieteMagique, indexProprieteMagique: this.indexProprieteMagique});
        this.getPrixAndCurrency();
    }

    getPrixAndCurrency() {
        this.prixProprieteMagique = 0;
        this.proprieteMagiqueCurrencyType = null;
        const data = this.proprieteMagique.infos.data;
        const indexPrix = data.indexOf(data.filter(f => f.includes('Prix'))[0]);
        if (indexPrix !== -1 && !data[indexPrix].includes('bonus')) {
            const match = data[indexPrix].match(/([0-9]+ )+/)[0];
            this.prixProprieteMagique = +match.replace(' ', '').replace(' ', '');
            const matchCurrency = data[indexPrix].substring(data[indexPrix].indexOf(match)).match(/[a-z]+[ |\.]/)[0];
            this.proprieteMagiqueCurrencyType = matchCurrency.replace(match, '')
                .replace(' ', '').replace('.', '');
        } else {
            this.prixProprieteMagique = 1;
            this.proprieteMagiqueCurrencyType = 'prix non défini';
        }
    }

    checkProprietesMagiquesIntegrity() {
        for (let indexDescription = 0 ; indexDescription < this.proprieteMagique.description.length ; indexDescription++) {
            if (this.proprieteMagique.description[indexDescription].length === 0) {
                this.proprieteMagique.description.splice(indexDescription, 1);
                indexDescription--;
            }
        }
        if (this.proprieteMagique.table) {
            for (let indexTable = 0; indexTable < this.proprieteMagique.table.length; indexTable++) {
                for (let indexTableTitle = 0; indexTableTitle <
                this.proprieteMagique.table[indexTable].title.length; indexTableTitle++) {
                    for (let indexTableTitleContent = 0; indexTableTitleContent <
                    this.proprieteMagique.table[indexTable].title[indexTableTitle].length; indexTableTitleContent++) {
                        if (this.proprieteMagique.table[indexTable].title[indexTableTitle][indexTableTitleContent].length === 0) {
                            this.proprieteMagique.table[indexTable].title[indexTableTitle].splice(indexTableTitleContent, 1);
                            indexTableTitleContent--;
                        }
                    }
                    if (this.proprieteMagique.table[indexTable].title[indexTableTitle].length === 0) {
                        this.proprieteMagique.table[indexTable].title.splice(indexTableTitle, 1);
                        indexTableTitle--;
                    }
                }
                for (let indexTableTr = 0; indexTableTr <
                this.proprieteMagique.table[indexTable].tr.length; indexTableTr++) {
                    for (let indexTableTrContent = 0; indexTableTrContent <
                    this.proprieteMagique.table[indexTable].tr[indexTableTr].length; indexTableTrContent++) {
                        if (this.proprieteMagique.table[indexTable].tr[indexTableTr][indexTableTrContent].length === 0) {
                            this.proprieteMagique.table[indexTable].tr[indexTableTr].splice(indexTableTrContent, 1);
                            indexTableTrContent--;
                        }
                    }
                    if (this.proprieteMagique.table[indexTable].tr[indexTableTr].length === 0) {
                        this.proprieteMagique.table[indexTable].tr.splice(indexTableTr, 1);
                        indexTableTr--;
                    }
                }
                if (this.proprieteMagique.table[indexTable].title.length === 0
                    && this.proprieteMagique.table[indexTable].tr.length === 0) {
                    this.proprieteMagique.table.splice(indexTable, 1);
                    indexTable--;
                }
            }
        }
        if (this.proprieteMagique.ul) {
            for (let indexUl = 0; indexUl < this.proprieteMagique.ul.length; indexUl++) {
                for (let indexLi = 0; indexLi < this.proprieteMagique.ul[indexUl].li.length; indexLi++) {
                    if (this.proprieteMagique.ul[indexUl].li[indexLi].length === 0) {
                        this.proprieteMagique.ul[indexUl].li.splice(indexLi, 1);
                        indexLi--;
                    }
                }
                if (this.proprieteMagique.ul.length === 0) {
                    this.proprieteMagique.ul.splice(indexUl, 1);
                    indexUl--;
                }
            }
        }
        if (this.proprieteMagique.description.length === 0
            && !this.proprieteMagique.table
            && !this.proprieteMagique.ul) {
            console.log('Suppression de la propriete magique :' + this.proprieteMagique.title);
            this.proprieteMagique = null;
        }
    }

    getNbProprietesMagiques(proprietesMagiques: SortedMagicalProperty): number {
        return this.getProprietesMagiques(proprietesMagiques).length;
    }

    loadComplete(): boolean {
        // console.log(this.allProprietesMagiques);
        // console.log(!!this.allProprietesMagiques);
        return !!this.allProprietesMagiques;
    }

    getProprietesMagiques(proprietesMagiques: SortedMagicalProperty) {
        // console.log(proprietesMagiques);
        return this.dePuissance === 1 ? proprietesMagiques.weakAndSmall.concat(proprietesMagiques.unknown)
            : this.dePuissance === 2 ? proprietesMagiques.moderate.concat(proprietesMagiques.unknown)
                : this.dePuissance === 3 ? proprietesMagiques.strongAnfPowerful.concat(proprietesMagiques.unknown) :
                    null;
    }

    getProprieteMagique() {
        if (this.dePuissance && this.deProprieteMagique
            && this.deProprieteMagique <= this.getNbProprietesMagiques(this.allProprietesMagiques)) {
            this.proprieteMagique = JSON.parse(JSON.stringify(
                    this.getProprietesMagiques(this.allProprietesMagiques)[this.deProprieteMagique - 1])) as MagicalProperty;
            this.proprieteMagiqueOriginal = JSON.parse(JSON.stringify(this.proprieteMagique)) as MagicalProperty;
            this.getPrixAndCurrency();
            this.proprieteMagiqueEventEmitter
                .emit({ proprieteMagique: this.proprieteMagique, indexProprieteMagique: this.indexProprieteMagique});
        }
    }

}
