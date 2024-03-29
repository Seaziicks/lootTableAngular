import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {JSonLoadService} from '../../services/json-load.service';
import {ObjetCombat} from '../objet-combat';
import {MaledictionsComponent} from '../maledictions/maledictions.component';

@Component({
    selector: 'app-armures',
    templateUrl: './armures.component.html',
    styleUrls: ['./armures.component.scss']
})
export class ArmuresComponent extends ObjetCombat implements OnInit {

    @Output() armureEventEmitter = new EventEmitter<ArmuresComponent>();
    @ViewChild('maledictionsComponent') maledictionComponent: MaledictionsComponent;
    @Input() maudit: boolean;

    bouclier = false;

    allArmuresSpeciales: SortedMagicalProperty;
    allBoucliersSpeciaux: SortedMagicalProperty;

    armure: Armure;
    taille: PrixParTaille;

    allArmures: CategoriesArmures;

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
    }

    async ngOnInit() {
        const donnees = await Promise.all(
            [
                this.jsonService.getJSON('magique', 'effetsArmuresMagiques'),
                this.jsonService.getJSON('magique', 'armuresMagiquesSpeciales'),
                this.jsonService.getJSON('magique', 'boucliersSpeciaux'),
                this.jsonService.getJSON('objets/classique', 'armures'),

            ]
        );
        this.allProprietesMagiques = donnees[0] as SortedMagicalProperty;
        this.allArmuresSpeciales = donnees[1] as SortedMagicalProperty;
        this.allBoucliersSpeciaux = donnees[2] as SortedMagicalProperty;
        this.allArmures = donnees[3] as CategoriesArmures;
        this.getArrayPourNbProprieteMagique();
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
                    console.log('Je suis bonus +2');
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
        if (!this.isSpecial && this.categorieObjet) {
            this.armure = JSON.parse(JSON.stringify(
                this.allArmures.Categories.find(f => f.title === this.categorieObjet).armures[this.deObjet - 1])) as Armure;
            this.setNom();
            this.setType();
        } else {
            this.type = null;
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
                    this.getProprietesMagiques(this.allBoucliersSpeciaux)[this.deSpecial - 1])) as MagicalProperty;
            } else if (!this.bouclier && this.deSpecial <= this.getNbProprietesMagiques(this.allArmuresSpeciales)) {
                special = JSON.parse(JSON.stringify(
                    this.getProprietesMagiques(this.allArmuresSpeciales)[this.deSpecial - 1])) as MagicalProperty;
            }
            if (special) {
                this.bonus = 0;
                this.proprietesMagiques.push(special);
                this.nom = special.title;
                this.getPrixAndCurrency();
            }
            this.deNombreProprietesMagiques = 1;
            this.getArrayPourNbProprieteMagique();
        }
    }

    getNbSpecials(): number {
        return this.bouclier ? this.getNbProprietesMagiques(this.allBoucliersSpeciaux)
            : this.getNbProprietesMagiques(this.allArmuresSpeciales);
    }

    setArmure() {
        this.resetHard();
        if (this.deObjet && !this.isSpecial) {
            this.armure = JSON.parse(JSON.stringify(
                this.allArmures.Categories.find(f => f.title === this.categorieObjet).armures[this.deObjet - 1])) as Armure;
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
        this.taille = JSON.parse(JSON.stringify(this.armure.prixParTaille.find(f => f.taille === this.nomTaille))) as PrixParTaille;
        this.prix = +this.taille.prixHumanoide.match(/([0-9]+ )+/)[0].replace(' ', '');
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
        this.materiau = JSON.parse(JSON.stringify(
            this.armure.autresMateriaux.find(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1') === this.nomMateriau))) as Materiau;
        this.prix = +this.taille.prixHumanoide.match(/([0-9]+ )+/)[0].replace(' ', '');
        const prixDuMateriau: number = +this.materiau.prix.match(/([0-9]+ )+/)[0]
            .replace(' ', '').replace(' ', '');
        const prixDeBase: number = +this.armure.prixParTaille.find(f => f.taille === 'Moyenne')
            .prixHumanoide.match(/([0-9]+ )+/)[0].replace(' ', '');
        this.prix = this.prix * (prixDuMateriau / prixDeBase);
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
        this.nom += ' ' + this.getNomsProprieteMagique();
        // console.log(this.nom);
    }

    setType() {
        this.type = !this.isSpecial ? this.categorieObjet
            :  this.bouclier ? 'Bouclier spécial'
                : 'Armure spéciale';
    }

    resetHard() {
        super.resetHard();
        this.taille = undefined;
    }

    resetContenu() {
        super.resetContenu();
        this.setMateriau();
        this.setArmure();
        this.setTaille();
        this.setType();
    }

    selection() {
        super.selection();
        this.armureEventEmitter.emit(this);
    }

    deselection() {
        this.valide = false;
        this.armureEventEmitter.emit(null);
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
            prixNonHumanoide: this.prix,
            devise: this.currencyType,
            proprieteMagique: this.proprietesMagiques,
            malediction: maledictionToAdd,
            categorie: this.categorieObjet,
            materiau: this.materiau,
            taille: this.taille.taille,
            degats: null,
            critique: null,
            facteurPortee: null,
            armure: +this.armure.bonArm.replace('—', '0').replace('+', ''),
            bonusDexteriteMax: +this.armure.bonDext.replace('—', '0').replace('+', ''),
            malusArmureTests: +this.armure.malArm.replace('—', '0'),
            risqueEchecSorts: this.armure.RisqEch,
            afficherNom: this.afficherNom,
            afficherEffetMagique: this.afficherEffetMagique,
            afficherMalediction: this.afficherMalediction,
            afficherMateriau: this.afficherMateriau,
            afficherInfos: this.afficherInfos,
        } as ObjetCommunForDB;

        return values;
    }

    public getAllMagiques() {
        return this.isSpecial ?
            this.bouclier ? this.allBoucliersSpeciaux
                : this.allArmuresSpeciales
            : this.allProprietesMagiques;
    }
}
