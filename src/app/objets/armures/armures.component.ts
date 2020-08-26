import { Component, OnInit } from '@angular/core';
import {
    Arme,
    Armure,
    CategoriesArmes,
    CategoriesArmures, DegatsParTaille,
    MagicalProperty, Materiau, PrixParTaille, SortedMagicalProperty,
    TablesChances
} from '../../interface/MonstreGroupe';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';

@Component({
  selector: 'app-armures',
  templateUrl: './armures.component.html',
  styleUrls: ['./armures.component.scss']
})
export class ArmuresComponent implements OnInit {

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

    isSpeciale = false;
    isMagique = false;
    bouclier = false;

    allProprietesMagiques: SortedMagicalProperty;
    allArmuresSpeciales: SortedMagicalProperty;
    allBoucliersSpeciaux: SortedMagicalProperty;

    categorieArmure: string;
    armure: Armure;
    taille: PrixParTaille;
    nomTaille: string;
    materiau: Materiau;
    nomMateriau: string;

    deArmure: number;
    Categories: number;

    allArmures: CategoriesArmures;

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
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
        this.isSpeciale = false;
        this.isMagique = false;
        this.deSpecial = undefined;
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        switch (this.dePuissance) {
            case 1:
                if (this.deBonus <= 60) {
                    this.bonus = 1;
                    this.bouclier = true;
                } else if (this.deBonus > 60 && this.deBonus <= 80) {
                    this.bonus = 1;
                    this.bouclier = false;
                } else if (this.deBonus > 80 && this.deBonus <= 85) {
                    this.bonus = 2;
                    this.bouclier = true;
                } else if (this.deBonus > 85 && this.deBonus <= 87) {
                    this.bonus = 2;
                    this.bouclier = false;
                } else if (this.deBonus > 87 && this.deBonus <= 89) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 89 && this.deBonus <= 91) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 91 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus <= 5) {
                    this.bonus = 1;
                    this.bouclier = true;
                } else if (this.deBonus > 5 && this.deBonus <= 10) {
                    this.bonus = 1;
                    this.bouclier = false;
                } else if (this.deBonus > 10 && this.deBonus <= 20) {
                    this.bonus = 2;
                    this.bouclier = true;
                } else if (this.deBonus > 20 && this.deBonus <= 30) {
                    this.bonus = 2;
                    this.bouclier = false;
                } else if (this.deBonus > 30 && this.deBonus <= 40) {
                    this.bonus = 3;
                    this.bouclier = true;
                } else if (this.deBonus > 40 && this.deBonus <= 50) {
                    this.bonus = 3;
                    this.bouclier = false;
                } else if (this.deBonus > 50 && this.deBonus <= 55) {
                    this.bonus = 4;
                    this.bouclier = true;
                } else if (this.deBonus > 55 && this.deBonus <= 57) {
                    this.bonus = 4;
                    this.bouclier = false;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus <= 8) {
                    this.bonus = 3;
                    this.bouclier = true;
                } else if (this.deBonus > 8 && this.deBonus <= 16) {
                    this.bonus = 3;
                    this.bouclier = false;
                } else if (this.deBonus > 16 && this.deBonus <= 27) {
                    this.bonus = 4;
                    this.bouclier = true;
                } else if (this.deBonus > 27 && this.deBonus <= 38) {
                    this.bonus = 4;
                    this.bouclier = false;
                } else if (this.deBonus > 38 && this.deBonus <= 49) {
                    this.bonus = 5;
                    this.bouclier = true;
                } else if (this.deBonus > 49 && this.deBonus <= 57) {
                    this.bonus = 5;
                    this.bouclier = false;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type =  'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
        }
        return this.bouclier;
    }

    setType() {
        if (this.bouclier) {
            this.getArmureOrBouclier('boucliers');
        } else if (!this.bouclier) {
            this.getArmureOrBouclier('armures');
        }
    }

    getArmureOrBouclier(file: string) {
        this.jsonService.getJSON('objets', file).then(
            (data: any) => {
                // console.log(data);
                const armuresOrBoucliers: TablesChances = JSON.parse(data) as TablesChances;
                // console.log(armuresOrBoucliers);
                this.getFromChance(armuresOrBoucliers, this.deType, file);
            }
        );
    }

    getFromChance(armuresOrBoucliers: TablesChances, dice: number, type: string) {
        const armureOrBouclier = armuresOrBoucliers.Chances
            .filter(chance => (chance.lootChanceMin <= dice && chance.lootChanceMax >= dice))[0];
        // this.nom = armureOrBouclier.name;
        this.prix += +(armureOrBouclier.price);
        // this.type = type.charAt(0).toUpperCase()  + type.slice(1, type.length - 1).toLowerCase();
    }

    getPropretesMagiques(proprietesMagiques: SortedMagicalProperty) {
        return this.dePuissance === 1 ? proprietesMagiques.weakAndSmall.concat(proprietesMagiques.unknown)
            : this.dePuissance === 2 ? proprietesMagiques.moderate.concat(proprietesMagiques.unknown)
                : this.dePuissance === 3 ? proprietesMagiques.strongAnfPowerful.concat(proprietesMagiques.unknown) :
                    null;
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.bonus = 0;
        if (this.deProprieteMagique && this.deProprieteMagique <= this.getNbProprietesMagiques(this.allProprietesMagiques)) {
            this.proprietesMagiques.push(
                JSON.parse(JSON.stringify(
                    this.getPropretesMagiques(this.allProprietesMagiques)[this.deProprieteMagique - 1])) as MagicalProperty);
            this.setBonus(this.proprietesMagiques[0].infos.data);
            console.log(this.bonus);
        }
    }

    getNbProprietesMagiques(proprietesMagiques: SortedMagicalProperty): number {
        return this.getPropretesMagiques(proprietesMagiques).length;
    }

    setBonus(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        console.log(data.indexOf(data.filter(f => f === 'Prix')[0]));
        console.log(data[indexPrix]);
        if (!isNaN(+data[indexPrix].replace('bonus de +', '').replace('.', ''))) {
            this.bonus += +data[indexPrix].replace('bonus de +', '').replace('.', '');
        }
    }

    getSpecial() {
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        this.reset();
        if (this.deSpecial) {
            let special: MagicalProperty = null;
            if (this.bouclier && this.deSpecial <= this.getNbProprietesMagiques(this.allBoucliersSpeciaux)) {
                special = this.allBoucliersSpeciaux[this.deSpecial - 1];
            } else if (!this.bouclier && this.deSpecial <= this.getNbProprietesMagiques(this.allArmuresSpeciales)) {
                special = this.allArmuresSpeciales[this.deSpecial - 1];
            }
            if (special) {
                this.bonus = 0;
                this.proprietesMagiques.push(special);
                this.nom = special.title;
                this.getPrixAndCurrency(special.infos.data);
            }
        }
    }

    getPrixAndCurrency(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        const match = data[indexPrix].match(/([0-9]+ )+/)[0];
        this.prix = +match.replace(' ', '');
        this.currencyType = data[indexPrix].replace(match, '')
            .replace(' ', '').replace('.', '');
    }

    getNbSpecials(): number {
        return this.bouclier ? this.getNbProprietesMagiques(this.allBoucliersSpeciaux)
            : this.getNbProprietesMagiques(this.allArmuresSpeciales);
    }

    reset() {
        this.proprietesMagiques = [];
        // this.type = undefined;
        this.bonus = undefined;
        // this.nom = undefined;
        this.prix = 0;
    }


    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
            this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }

    setArmure() {
        this.nomMateriau = null;
        this.nomTaille = null;
        this.materiau = null;
        this.taille = null;
        this.armure = this.allArmures.Categories.find(f => f.title === this.categorieArmure).armures[this.deArmure - 1];
        this.setNom();
    }

    getNbArmure() {
        this.type = this.categorieArmure;
        return this.allArmures.Categories.find(f => f.title === this.categorieArmure).armures.length;
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

    getNbTailleArme() {
        // console.log(this.arme);
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
}
