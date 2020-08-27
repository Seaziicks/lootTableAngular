import {Component, OnInit} from '@angular/core';
import {JSonLoadService} from '../../services/json-load.service';
import {
    Arme,
    CategoriesArmes, DegatsParTaille,
    MagicalProperty,
    SortedMagicalProperty,
} from '../../interface/MonstreGroupe';
import {ObjetCombat} from '../objet-combat';

@Component({
    selector: 'app-armes',
    templateUrl: './armes.component.html',
    styleUrls: ['./armes.component.scss']
})
export class ArmesComponent extends ObjetCombat implements OnInit {

    allProprietesMagiques: SortedMagicalProperty;
    allArmesSpeciales: SortedMagicalProperty;

    arme: Arme;
    taille: DegatsParTaille;

    allArmeCourantes: CategoriesArmes;
    allArmesGuerre: CategoriesArmes;
    allArmesExotiques: CategoriesArmes;
    allCategoriesCourante: CategoriesArmes;

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'effetsMagiquesArmes').then(
            (effetsMagiquesArmes: any) => {
                this.allProprietesMagiques = JSON.parse(effetsMagiquesArmes) as SortedMagicalProperty;
                this.jsonService.getJSON('magique', 'armesSpeciales').then(
                    (armesSpeciales: any) => {
                        this.allArmesSpeciales = JSON.parse(armesSpeciales) as SortedMagicalProperty;
                    }
                );
            }
        );
        this.jsonService.getJSON('objets/classique', 'armesCourantes').then(
            (armesCourantes: any) => {
                this.allArmeCourantes = JSON.parse(armesCourantes) as CategoriesArmes;
            }
        );
        this.jsonService.getJSON('objets/classique', 'armesGuerre').then(
            (armesCourantes: any) => {
                this.allArmesGuerre = JSON.parse(armesCourantes) as CategoriesArmes;
            }
        );
        this.jsonService.getJSON('objets/classique', 'armesExotiques').then(
            (armesCourantes: any) => {
                this.allArmesExotiques = JSON.parse(armesCourantes) as CategoriesArmes;
            }
        );
    }

    setBonusArme() {
        this.reset();
        this.isSpecial = false;
        this.isMagique = false;
        this.deSpecial = undefined;
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        this.bonus = undefined;
        switch (this.dePuissance) {
            case 1:
                if (this.deBonus && this.deBonus <= 70) {
                    this.bonus = 1;
                } else if (this.deBonus > 70 && this.deBonus <= 85) {
                    this.bonus = 2;
                } else if (this.deBonus > 85 && this.deBonus <= 90) {
                    this.bonus = 0;
                    this.isSpecial = true;
                } else if (this.deBonus > 90 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus && this.deBonus <= 10) {
                    this.bonus = 1;
                } else if (this.deBonus > 10 && this.deBonus <= 29) {
                    this.bonus = 2;
                } else if (this.deBonus > 29 && this.deBonus <= 58) {
                    this.bonus = 3;
                } else if (this.deBonus > 58 && this.deBonus <= 62) {
                    this.bonus = 4;
                } else if (this.deBonus > 62 && this.deBonus <= 68) {
                    this.bonus = 0;
                    this.isSpecial = true;
                } else if (this.deBonus > 68 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus && this.deBonus <= 20) {
                    this.bonus = 3;
                } else if (this.deBonus > 20 && this.deBonus <= 38) {
                    this.bonus = 4;
                } else if (this.deBonus > 38 && this.deBonus <= 49) {
                    this.bonus = 5;
                } else if (this.deBonus > 49 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpecial = true;
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 1;
                    this.isMagique = true;
                }
                break;
        }
        if (!this.isSpecial && this.Categories) {
            this.arme = this.allCategoriesCourante.Categories.find(f => f.title === this.categorieObjet).armes[this.deObjet - 1];
            this.setNom();
        } else {
            this.type = null;
            this.nom = null;
        }
    }

    getArmeSpeciale() {
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        this.nom = undefined;
        this.reset();
        if (this.deSpecial && this.deSpecial <= this.getNbProprietesMagiques(this.allArmesSpeciales)) {
            const armeSpecial: MagicalProperty = JSON.parse(JSON.stringify(
                this.getPropretesMagiques(this.allArmesSpeciales)[this.deSpecial - 1])) as MagicalProperty;
            this.type = 'Arme speciale';
            this.bonus = 0;
            this.proprietesMagiques.push(armeSpecial);
            this.nom = armeSpecial.title;
            this.getPrixAndCurrency(armeSpecial.infos.data);
        }
    }

    getPrixFromBonus() {
        switch (this.bonus) {
            case 1:
                this.prix = 2000;
                break;
            case 2:
                this.prix = 8000;
                break;
            case 3:
                this.prix = 18000;
                break;
            case 4:
                this.prix = 32000;
                break;
            case 5:
                this.prix = 50000;
                break;
        }
    }

    setArme() {
        this.resetHard();
        if (!this.isSpecial) {
            this.arme = this.allCategoriesCourante.Categories.find(f => f.title === this.categorieObjet).armes[this.deObjet - 1];
            this.type = this.categorieObjet;
            this.setNom();
        } else {
            this.type = null;
            this.nom = null;
        }
    }

    getNbArme() {
        return this.allCategoriesCourante.Categories.find(f => f.title === this.categorieObjet).armes.length;
    }

    setAllArmesCourantes() {
        this.deObjet = null;
        this.allCategoriesCourante = null;
        if (+this.Categories === 1) {
            this.allCategoriesCourante = this.allArmeCourantes;
        } else if (+this.Categories === 2) {
            this.allCategoriesCourante = this.allArmesGuerre;
        } else if (+this.Categories === 3) {
            this.allCategoriesCourante = this.allArmesExotiques;
        }
    }

    allCategoriesLoaded() {
        return !!(this.allArmeCourantes && this.allArmesExotiques && this.allArmesGuerre);
    }

    setTaille() {
        this.taille = this.arme.degatsParTaille.find(f => f.taille === this.nomTaille);
        this.setNom();
    }

    getNomsTailles() {
        return this.arme.degatsParTaille.map(f => f.taille);
    }

    getTailles() {
        return this.arme.degatsParTaille;
    }

    getDegats() {
        return this.taille.degats === '-' ? '1d0'
            : this.taille.degats === '1' ? '1d1'
                : this.taille.degats;
    }

    getNbTailleArme() {
        // console.log(this.arme);
        return this.arme.degatsParTaille.length;
    }

    setMateriau() {
        this.materiau = this.arme.autresMateriaux.find(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1') === this.nomMateriau);
        this.setNom();
    }

    getNomsMateriaux() {
        return this.arme.autresMateriaux.map(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1'));
    }

    getMateriaux() {
        return this.arme.autresMateriaux;
    }

    getNbMateriaux() {
        return this.arme.autresMateriaux.length;
    }

    setNom() {
        if (this.arme) {
            this.nom = this.arme.nom;
        }
        if (this.taille) {
            this.nom += ' ' + this.taille.taille;
        }
        if (this.materiau) {
            this.nom += ' en ' + this.materiau.nom;
        }
        // console.log(this.nom);
    }

    resetHard() {
        super.resetHard();
        this.taille = undefined;
    }
}
