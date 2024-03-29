import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {JSonLoadService} from '../../services/json-load.service';
import {ObjetCombat} from '../objet-combat';
import {MaledictionsComponent} from '../maledictions/maledictions.component';

@Component({
    selector: 'app-armes',
    templateUrl: './armes.component.html',
    styleUrls: ['./armes.component.scss']
})
export class ArmesComponent extends ObjetCombat implements OnInit {

    @Output() armeEventEmitter = new EventEmitter<ArmesComponent>();
    @ViewChild('maledictionsComponent') maledictionComponent: MaledictionsComponent;
    @Input() maudit: boolean;

    allArmesSpeciales: SortedMagicalProperty;

    arme: Arme;
    taille: DegatsParTaille;
    degats: string;

    allArmeCourantes: CategoriesArmes;
    allArmesGuerre: CategoriesArmes;
    allArmesExotiques: CategoriesArmes;
    allCategoriesCourante: CategoriesArmes;

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
    }

    async ngOnInit() {
        // Permet de faire les requêtes en parallèle.
        const donnees = await Promise.all(
            [
                this.jsonService.getJSON('magique', 'effetsMagiquesArmes'),
                this.jsonService.getJSON('magique', 'armesSpeciales'),
                this.jsonService.getJSON('objets/classique', 'armesCourantes'),
                this.jsonService.getJSON('objets/classique', 'armesGuerre'),
                this.jsonService.getJSON('objets/classique', 'armesExotiques'),
            ]
        );
        this.allProprietesMagiques = donnees[0] as SortedMagicalProperty;
        this.allArmesSpeciales = donnees[1] as SortedMagicalProperty;
        this.allArmeCourantes = donnees[2] as CategoriesArmes;
        this.allArmesGuerre = donnees[3] as CategoriesArmes;
        this.allArmesExotiques = donnees[4] as CategoriesArmes;
        this.getArrayPourNbProprieteMagique();
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
        if (!this.isSpecial && this.categorieObjet) {
            this.arme = JSON.parse(JSON.stringify(
                this.allCategoriesCourante.Categories.find(f => f.title === this.categorieObjet).armes[this.deObjet - 1])) as Arme;
            this.setNom();
            this.setType();
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
                this.getProprietesMagiques(this.allArmesSpeciales)[this.deSpecial - 1])) as MagicalProperty;
            this.setType();
            this.bonus = 0;
            this.proprietesMagiques.push(armeSpecial);
            this.nom = armeSpecial.title;
            this.getPrixAndCurrency();
        }
        this.deNombreProprietesMagiques = 1;
        this.getArrayPourNbProprieteMagique();
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
            if (this.deObjet) {
                this.arme = JSON.parse(JSON.stringify(
                    this.allCategoriesCourante.Categories.find(f => f.title === this.categorieObjet).armes[this.deObjet - 1])) as Arme;
                this.setType();
                this.setNom();
            }
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
        this.taille = JSON.parse(JSON.stringify(this.arme.degatsParTaille.find(f => f.taille === this.nomTaille))) as DegatsParTaille;
        this.getDegats();
        this.setNom();
    }

    getNomsTailles() {
        return this.arme.degatsParTaille.map(f => f.taille);
    }

    getTailles() {
        return this.arme.degatsParTaille;
    }

    getDegats() {
        this.degats = this.taille.degats === '-' ? '1d0'
            : this.taille.degats === '1' ? '1d1'
                : this.taille.degats;
    }

    getNbTailleArme() {
        // console.log(this.arme);
        return this.arme.degatsParTaille.length;
    }

    setMateriau() {
        this.materiau = JSON.parse(JSON.stringify(
            this.arme.autresMateriaux.find(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1') === this.nomMateriau))) as Materiau;
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
        this.nom += ' ' + this.getNomsProprieteMagique();
        // console.log(this.nom);
    }

    setType() {
        this.type = this.isSpecial ? 'Arme spéciale' : this.categorieObjet;
    }

    resetHard() {
        super.resetHard();
        this.taille = undefined;
    }

    resetContenu() {
        super.resetContenu();
        this.getDegats();
        this.setMateriau();
        this.setTaille();
        this.setType();
    }

    selection() {
        super.selection();
        this.armeEventEmitter.emit(this);
    }

    deselection() {
        this.valide = false;
        this.armeEventEmitter.emit(null);
    }

    castToObjetCommunForDB(idPersonnageSelectionnee: number = 0): ObjetCommunForDB {
        const maledictionToAdd = this.getMalediction();
        let values: ObjetCommunForDB;
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
            categorie: this.categorieObjet,
            materiau: this.materiau,
            taille: this.taille.taille,
            degats: this.degats,
            critique: this.arme.critique,
            facteurPortee: this.arme.facteurPortee,
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

    public getAllMagiques() {
        return this.isSpecial ? this.allArmesSpeciales : this.allProprietesMagiques;
    }
}
