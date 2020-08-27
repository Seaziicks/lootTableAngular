import {
    MagicalProperty,
    Materiau,
    SortedMagicalProperty
} from '../interface/MonstreGroupe';
import {JSonLoadService} from '../services/json-load.service';

export class ObjetCombat {

    nom: string;
    bonus: number;
    type: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;
    currencyType: string;

    dePuissance: number;
    deBonus: number;
    deProprieteMagique: number;
    deSpecial: number;
    deType: number;

    isSpecial = false;
    isMagique = false;

    allProprietesMagiques: SortedMagicalProperty;

    categorieObjet: string;
    nomTaille: string;
    materiau: Materiau;
    nomMateriau: string;

    deObjet: number;
    Categories: number;

    constructor(jsonService: JSonLoadService) {
    }

    getPropretesMagiques(proprietesMagiques: SortedMagicalProperty) {
        return this.dePuissance === 1 ? proprietesMagiques.weakAndSmall.concat(proprietesMagiques.unknown)
            : this.dePuissance === 2 ? proprietesMagiques.moderate.concat(proprietesMagiques.unknown)
                : this.dePuissance === 3 ? proprietesMagiques.strongAnfPowerful.concat(proprietesMagiques.unknown) :
                    null;
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.bonus = 1;
        if (this.deProprieteMagique && this.deProprieteMagique <= this.getNbProprietesMagiques(this.allProprietesMagiques)) {
            this.proprietesMagiques.push(
                JSON.parse(JSON.stringify(
                    this.getPropretesMagiques(this.allProprietesMagiques)[this.deProprieteMagique - 1])) as MagicalProperty);
            this.setBonus(this.proprietesMagiques[0].infos.data);
            console.log(this.bonus);
        }
    }

    setBonus(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        console.log(data.indexOf(data.filter(f => f === 'Prix')[0]));
        console.log(data[indexPrix]);
        if (!isNaN(+data[indexPrix].replace('bonus de +', '').replace('.', ''))) {
            this.bonus = +data[indexPrix].replace('bonus de +', '').replace('.', '');
        }
    }

    getNbProprietesMagiques(proprietesMagiques: SortedMagicalProperty): number {
        return this.getPropretesMagiques(proprietesMagiques).length;
    }

    getPrixAndCurrency(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f.includes('Prix'))[0]);
        const match = data[indexPrix].match(/([0-9]+ )+/)[0];
        this.prix = +match.replace(' ', '');
        const matchCurrency = data[indexPrix].substring(data[indexPrix].indexOf(match)).match(/[a-z]+[ |\.]/)[0];
        this.currencyType = matchCurrency.replace(match, '')
            .replace(' ', '').replace('.', '');
    }

    getNomsProprieteMagique(): string {
        return this.isSpecial ? ''
            : this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title
                : this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }

    reset() {
        this.proprietesMagiques = [];
        this.bonus = 1;
        this.prix = 0;
    }

    resetHard() {
        this.nomMateriau = undefined;
        this.nomTaille = undefined;
        this.materiau = undefined;
    }
}
