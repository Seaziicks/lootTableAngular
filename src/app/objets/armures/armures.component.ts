import {Component, OnInit} from '@angular/core';
import {
    Armure, CategoriesArmures, MagicalProperty, PrixParTaille, SortedMagicalProperty
} from '../../interface/MonstreGroupe';
import {JSonLoadService} from '../../services/json-load.service';
import {ObjetCombat} from '../objet-combat';

@Component({
    selector: 'app-armures',
    templateUrl: './armures.component.html',
    styleUrls: ['./armures.component.scss']
})
export class ArmuresComponent extends ObjetCombat implements OnInit {

    bouclier = false;

    allProprietesMagiques: SortedMagicalProperty;
    allArmuresSpeciales: SortedMagicalProperty;
    allBoucliersSpeciaux: SortedMagicalProperty;

    armure: Armure;
    taille: PrixParTaille;

    allArmures: CategoriesArmures;

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'effetsArmuresMagiques').then(
            (effetsArmuresMagiques: any) => {
                this.allProprietesMagiques = JSON.parse(effetsArmuresMagiques) as SortedMagicalProperty;
                this.jsonService.getJSON('magique', 'armuresMagiquesSpeciales').then(
                    (armuresMagiquesSpeciales: any) => {
                        this.allArmuresSpeciales = JSON.parse(armuresMagiquesSpeciales) as SortedMagicalProperty;
                        this.jsonService.getJSON('magique', 'boucliersSpeciaux').then(
                            (boucliersSpeciaux: any) => {
                                this.allBoucliersSpeciaux = JSON.parse(boucliersSpeciaux) as SortedMagicalProperty;
                            }
                        );
                    }
                );
            }
        );
        this.jsonService.getJSON('objets/classique', 'armures').then(
            (armuresCourantes: any) => {
                this.allArmures = JSON.parse(armuresCourantes) as CategoriesArmures;
            }
        );
    }

    isBouclier() {
        this.reset();
        this.isSpecial = false;
        this.isMagique = false;
        this.deSpecial = undefined;
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        switch (this.dePuissance) {
            case 1:
                if (this.deBonus && this.deBonus <= 80) {
                    this.bonus = 1;
                } else if (this.deBonus > 80 && this.deBonus <= 87) {
                    this.bonus = 2;
                } else if (this.deBonus > 87 && this.deBonus <= 89) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 89 && this.deBonus <= 91) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 91 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus && this.deBonus <= 10) {
                    this.bonus = 1;
                } else if (this.deBonus > 10 && this.deBonus <= 30) {
                    this.bonus = 2;
                } else if (this.deBonus > 30 && this.deBonus <= 50) {
                    this.bonus = 3;
                } else if (this.deBonus > 50 && this.deBonus <= 57) {
                    this.bonus = 4;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus && this.deBonus <= 16) {
                    this.bonus = 3;
                } else if (this.deBonus > 16 && this.deBonus <= 38) {
                    this.bonus = 4;
                } else if (this.deBonus > 38 && this.deBonus <= 57) {
                    this.bonus = 5;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpecial = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
        }
        if (!this.isSpecial && this.Categories) {
            this.armure = this.allArmures.Categories.find(f => f.title === this.categorieObjet).armures[this.deObjet - 1];
            this.setNom();
        } else {
            this.nom = null;
        }
        return this.bouclier;
    }

    getSpecial() {
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        this.reset();
        if (this.deSpecial) {
            let special: MagicalProperty = null;
            if (this.bouclier && this.deSpecial <= this.getNbProprietesMagiques(this.allBoucliersSpeciaux)) {
                special = JSON.parse(JSON.stringify(
                    this.getPropretesMagiques(this.allBoucliersSpeciaux)[this.deSpecial - 1])) as MagicalProperty;
            } else if (!this.bouclier && this.deSpecial <= this.getNbProprietesMagiques(this.allArmuresSpeciales)) {
                special = JSON.parse(JSON.stringify(
                    this.getPropretesMagiques(this.allArmuresSpeciales)[this.deSpecial - 1])) as MagicalProperty;
            }
            if (special) {
                this.bonus = 0;
                this.proprietesMagiques.push(special);
                this.nom = special.title;
                this.getPrixAndCurrency(special.infos.data);
            }
        }
    }

    getNbSpecials(): number {
        return this.bouclier ? this.getNbProprietesMagiques(this.allBoucliersSpeciaux)
            : this.getNbProprietesMagiques(this.allArmuresSpeciales);
    }

    setArmure() {
        this.resetHard();
        if (!this.isSpecial) {
            this.armure = this.allArmures.Categories.find(f => f.title === this.categorieObjet).armures[this.deObjet - 1];
            this.bouclier = this.categorieObjet === 'Boucliers';
            this.type = this.categorieObjet;
            this.setNom();
        } else {
            this.type = null;
            this.nom = null;
        }
    }

    getNbArmure() {
        return this.allArmures.Categories.find(f => f.title === this.categorieObjet).armures.length;
    }

    setTaille() {
        this.taille = this.armure.prixParTaille.find(f => f.taille === this.nomTaille);
        this.setNom();
    }

    getNomsTailles() {
        return this.armure.prixParTaille.map(f => f.taille);
    }

    getTailles() {
        return this.armure.prixParTaille;
    }

    getNbTailleArmure() {
        // console.log(this.armure);
        return this.armure.prixParTaille.length;
    }

    setMateriau() {
        this.materiau = this.armure.autresMateriaux.find(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1') === this.nomMateriau);
        this.setNom();
    }

    getNomsMateriaux() {
        return this.armure.autresMateriaux.map(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1'));
    }

    getMateriaux() {
        return this.armure.autresMateriaux;
    }

    getNbMateriaux() {
        return this.armure.autresMateriaux.length;
    }

    setNom() {
        if (this.armure) {
            this.nom = this.armure.nom;
        }
        if (this.taille) {
            this.nom += ' ' + this.taille.taille;
        }
        if (this.materiau) {
            this.nom += ' en ' + this.materiau.nom;
        }
        console.log(this.nom);
    }

    resetHard() {
        super.resetHard();
        this.taille = undefined;
    }
}
