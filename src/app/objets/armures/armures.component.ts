import { Component, OnInit } from '@angular/core';
import {MagicalProperty, TablesChances} from '../../interface/MonstreGroupe';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';

@Component({
  selector: 'app-armures',
  templateUrl: './armures.component.html',
  styleUrls: ['./armures.component.scss']
})
export class ArmuresComponent implements OnInit {

    nom: string;
    bonusArmure: number;
    type: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;

    dePuissance: number;
    deBonus: number;
    deProprieteMagique: number;
    deArmureSpeciale: number;
    deType: number;

    isSpeciale = false;
    isMagique = false;
    bouclier = false;

    allProprietesMagiques: MagicalProperty[] = [];
    allArmuresSpeciales: MagicalProperty[] = [];
    allBoucliersSpeciaux: MagicalProperty[] = [];

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'effetsArmuresMagiques').then(
            (effetsArmuresMagiques: any) => {
                this.allProprietesMagiques = JSON.parse(effetsArmuresMagiques) as MagicalProperty[];
                this.jsonService.getJSON('magique', 'armuresMagiquesSpeciales').then(
                    (armuresMagiquesSpeciales: any) => {
                        this.allArmuresSpeciales = JSON.parse(armuresMagiquesSpeciales) as MagicalProperty[];
                        this.jsonService.getJSON('magique', 'boucliersSpeciaux').then(
                            (boucliersSpeciaux: any) => {
                                this.allBoucliersSpeciaux = JSON.parse(boucliersSpeciaux) as MagicalProperty[];
                            }
                        );
                    }
                );
            }
        );
    }

    isBouclier() {
        this.reset();
        this.isSpeciale = false;
        this.isMagique = false;
        this.deArmureSpeciale = undefined;
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        switch (this.dePuissance) {
            case 1:
                if (this.deBonus <= 60) {
                    this.bonusArmure = 1;
                    this.bouclier = true;
                } else if (this.deBonus > 60 && this.deBonus <= 80) {
                    this.bonusArmure = 1;
                    this.bouclier = false;
                } else if (this.deBonus > 80 && this.deBonus <= 85) {
                    this.bonusArmure = 2;
                    this.bouclier = true;
                } else if (this.deBonus > 85 && this.deBonus <= 87) {
                    this.bonusArmure = 2;
                    this.bouclier = false;
                } else if (this.deBonus > 87 && this.deBonus <= 89) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 89 && this.deBonus <= 91) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 91 && this.deBonus <= 100) {
                    this.bonusArmure = 0;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus <= 5) {
                    this.bonusArmure = 1;
                    this.bouclier = true;
                } else if (this.deBonus > 5 && this.deBonus <= 10) {
                    this.bonusArmure = 1;
                    this.bouclier = false;
                } else if (this.deBonus > 10 && this.deBonus <= 20) {
                    this.bonusArmure = 2;
                    this.bouclier = true;
                } else if (this.deBonus > 20 && this.deBonus <= 30) {
                    this.bonusArmure = 2;
                    this.bouclier = false;
                } else if (this.deBonus > 30 && this.deBonus <= 40) {
                    this.bonusArmure = 3;
                    this.bouclier = true;
                } else if (this.deBonus > 40 && this.deBonus <= 50) {
                    this.bonusArmure = 3;
                    this.bouclier = false;
                } else if (this.deBonus > 50 && this.deBonus <= 55) {
                    this.bonusArmure = 4;
                    this.bouclier = true;
                } else if (this.deBonus > 55 && this.deBonus <= 57) {
                    this.bonusArmure = 4;
                    this.bouclier = false;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type = 'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonusArmure = 0;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus <= 8) {
                    this.bonusArmure = 3;
                    this.bouclier = true;
                } else if (this.deBonus > 8 && this.deBonus <= 16) {
                    this.bonusArmure = 3;
                    this.bouclier = false;
                } else if (this.deBonus > 16 && this.deBonus <= 27) {
                    this.bonusArmure = 4;
                    this.bouclier = true;
                } else if (this.deBonus > 27 && this.deBonus <= 38) {
                    this.bonusArmure = 4;
                    this.bouclier = false;
                } else if (this.deBonus > 38 && this.deBonus <= 49) {
                    this.bonusArmure = 5;
                    this.bouclier = true;
                } else if (this.deBonus > 49 && this.deBonus <= 57) {
                    this.bonusArmure = 5;
                    this.bouclier = false;
                } else if (this.deBonus > 57 && this.deBonus <= 60) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = false;
                    this.type =  'Armure speciale';
                } else if (this.deBonus > 60 && this.deBonus <= 63) {
                    this.bonusArmure = 0;
                    this.isSpeciale = true;
                    this.bouclier = true;
                    this.type = 'Bouclier special';
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonusArmure = 0;
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
                console.log(data);
                const armuresOrBoucliers: TablesChances = JSON.parse(data) as TablesChances;
                console.log(armuresOrBoucliers);
                this.getFromChance(armuresOrBoucliers, this.deType, file);
            }
        );
    }

    getFromChance(armuresOrBoucliers: TablesChances, dice: number, type: string) {
        const armureOrBouclier = armuresOrBoucliers.Chances
            .filter(chance => (chance.lootChanceMin <= dice && chance.lootChanceMax >= dice))[0];
        this.nom = armureOrBouclier.name;
        this.prix += +(armureOrBouclier.price);
        this.type = type.charAt(0).toUpperCase()  + type.slice(1, type.length - 1).toLowerCase();
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.proprietesMagiques.push(this.allProprietesMagiques[this.deProprieteMagique - 1]);
    }

    getSpecial() {
        this.deProprieteMagique = undefined;
        this.deType = undefined;
        this.reset();
        const special: MagicalProperty = this.bouclier ?
            this.allBoucliersSpeciaux[this.deArmureSpeciale - 1] : this.allArmuresSpeciales[this.deArmureSpeciale - 1];
        this.bonusArmure = 0;
        this.proprietesMagiques.push(special);
        this.nom = special.title;
    }

    getNbProprietesMagiques(): number {
        return this.allProprietesMagiques.length;
    }

    getNbSpecials(): number {
        return this.bouclier ? this.allBoucliersSpeciaux.length : this.allArmuresSpeciales.length;
    }

    reset() {
        this.proprietesMagiques = [];
        // this.type = undefined;
        this.bonusArmure = undefined;
        this.nom = undefined;
        this.prix = 0;
    }


    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
            this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }
}
