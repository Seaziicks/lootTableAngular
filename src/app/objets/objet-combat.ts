import {
    MagicalProperty,
    Materiau,
    SortedMagicalProperty
} from '../interface/MonstreGroupe';
import {JSonLoadService} from '../services/json-load.service';
import {ObjetCommun} from './objet-commun';

export abstract class ObjetCombat extends ObjetCommun {

    deBonus: number;
    deSpecial: number;
    deType: number;

    isSpecial = false;
    isMagique = false;

    categorieObjet: string;
    nomTaille: string;
    materiau: Materiau;
    nomMateriau: string;

    deObjet: number;
    Categories: number;

    constructor(jsonService: JSonLoadService) {
        super(jsonService);
    }

    getProprieteMagique() {
        this.bonus = 1;
        super.getProprieteMagique();
        this.setBonus();
    }

    setBonus() {
        if (this.deProprieteMagique && this.deProprieteMagique <= this.getNbProprietesMagiques(this.allProprietesMagiques)) {
            const data = this.proprietesMagiques[0].infos.data;
            const indexPrix = data.indexOf(data.filter(f => f.includes('Prix'))[0]);
            const bonusToNumber = data[indexPrix].match(/[Bb]onus.* \+([0-9])/);
            if (bonusToNumber && !isNaN(+bonusToNumber[1])) {
                this.bonus = +bonusToNumber[1];
            }
        }
    }

    getNomsProprieteMagique(): string {
        return this.isSpecial ? ''
            : this.proprietesMagiques.length < 1 ? ''
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
