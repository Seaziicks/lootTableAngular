import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';
import {MagicalProperty, TablesChances} from '../../interface/MonstreGroupe';

@Component({
    selector: 'app-armes',
    templateUrl: './armes.component.html',
    styleUrls: ['./armes.component.scss']
})
export class ArmesComponent implements OnInit {

    nom: string;
    bonus: number;
    type: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;
    currencyType: string;

    dePuissance: number;
    deBonus: number;
    deProprieteMagique: number;
    deArmeSpeciale: number;
    deTypeArme: number;
    deArmeCaC: number;
    deArmeDistance: number;
    deArmeInhabituelle: number;
    deMunitions: number;

    isSpeciale = false;
    isMagique = false;
    isCaC = false;
    isDistance = false;
    isInhabituelle = false;
    isMunitions = false;

    allProprietesMagiques: MagicalProperty[] = [];
    allArmesSpeciales: MagicalProperty[] = [];

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'effetsMagiquesArmes').then(
            (effetsMagiquesArmes: any) => {
                this.allProprietesMagiques = JSON.parse(effetsMagiquesArmes) as MagicalProperty[];
                this.jsonService.getJSON('magique', 'armesSpeciales').then(
                    (armesSpeciales: any) => {
                        this.allArmesSpeciales = JSON.parse(armesSpeciales) as MagicalProperty[];
                    }
                );
            }
        );
    }

    setBonusArme() {
        this.resetArme();
        this.isSpeciale = false;
        this.isMagique = false;
        this.deArmeSpeciale = undefined;
        this.deProprieteMagique = undefined;
        this.deTypeArme = undefined;
        this.deArmeCaC = undefined;
        this.deArmeDistance = undefined;
        this.deArmeInhabituelle = undefined;
        this.deMunitions = undefined;
        switch (this.dePuissance) {
            case 1:
                if (this.deBonus <= 70) {
                    this.bonus = 1;
                } else if (this.deBonus > 70 && this.deBonus <= 85) {
                    this.bonus = 2;
                } else if (this.deBonus > 85 && this.deBonus <= 90) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 90 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus <= 10) {
                    this.bonus = 1;
                } else if (this.deBonus > 10 && this.deBonus <= 29) {
                    this.bonus = 2;
                } else if (this.deBonus > 29 && this.deBonus <= 58) {
                    this.bonus = 3;
                } else if (this.deBonus > 58 && this.deBonus <= 62) {
                    this.bonus = 4;
                } else if (this.deBonus > 62 && this.deBonus <= 68) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 68 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus <= 20) {
                    this.bonus = 3;
                } else if (this.deBonus > 20 && this.deBonus <= 38) {
                    this.bonus = 4;
                } else if (this.deBonus > 38 && this.deBonus <= 49) {
                    this.bonus = 5;
                } else if (this.deBonus > 49 && this.deBonus <= 63) {
                    this.bonus = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonus = 0;
                    this.isMagique = true;
                }
                break;
        }
    }

    setTypeArme() {
        this.isCaC = false;
        this.isDistance = false;
        this.isInhabituelle = false;
        this.deArmeCaC = undefined;
        this.deArmeDistance = undefined;
        this.deArmeInhabituelle = undefined;
        this.deMunitions = undefined;
        if (this.deTypeArme <= 70) {
            this.isCaC = true;
            this.type = 'Armes de corp à corp';
        } else if (this.deTypeArme > 70 && this.deTypeArme <= 90) {
            this.isDistance = true;
            this.type = 'Armes à distance';
        } else if (this.deTypeArme > 90 && this.deTypeArme <= 100) {
            this.isInhabituelle = true;
            this.type = 'Armes inhabituelle';
        }
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        if (this.deProprieteMagique && this.deProprieteMagique <= this.allProprietesMagiques.length) {
            this.proprietesMagiques.push(this.allProprietesMagiques[this.deProprieteMagique - 1]);
        }
    }

    getArmeSpeciale() {
        this.deProprieteMagique = undefined;
        this.deTypeArme = undefined;
        this.deArmeCaC = undefined;
        this.deArmeDistance = undefined;
        this.deArmeInhabituelle = undefined;
        this.deMunitions = undefined;
        this.resetArme();
        if (this.deArmeSpeciale && this.deArmeSpeciale <= this.allArmesSpeciales.length) {
            const armeSpecial: MagicalProperty = this.allArmesSpeciales[this.deArmeSpeciale - 1];
            this.type = 'Speciale';
            this.bonus = 0;
            this.proprietesMagiques.push(armeSpecial);
            this.nom = armeSpecial.title;
        }
    }

    getNbProprietesMagiques(): number {
        return this.allProprietesMagiques.length;
    }

    getNbArmesSpeciales(): number {
        return this.allArmesSpeciales.length;
    }

    resetArme() {
        this.proprietesMagiques = [];
        this.type = undefined;
        this.bonus = undefined;
        this.nom = undefined;
        this.prix = 0;
    }

    getTypeArme() {
        if (this.isCaC) {
            this.getArme('armesCac');
        } else if (this.isDistance) {
            this.setIsMunitions();
            if (this.isMunitions) {
                this.getArme('munitions');
            } else {
                this.getArme('armesDistance');
            }
        } else if (this.isInhabituelle) {
            this.getArme('armesInhabituelles');
        }
    }

    getArme(file: string) {
        this.jsonService.getJSON('objets', file).then(
            (data: any) => {
                console.log(data);
                const armes: TablesChances = JSON.parse(data) as TablesChances;
                console.log(armes);
                const de = this.getCurrentDe();
                if (de) {
                    this.getFromChance(armes, de);
                }
            }
        );
    }

    getCurrentDe() {
        if (this.isCaC) {
            this.deArmeDistance = undefined;
            this.deArmeInhabituelle = undefined;
            this.deMunitions = undefined;
            return this.deArmeCaC;
        } else if (this.isMunitions) {
            this.deArmeCaC = undefined;
            this.deArmeInhabituelle = undefined;
            return this.deMunitions;
        } else if (this.isDistance) {
            this.deArmeCaC = undefined;
            this.deArmeInhabituelle = undefined;
            if (!this.isMunitions) {
                this.deMunitions = undefined;
            }
            return this.deArmeDistance;
        } else if (this.isInhabituelle) {
            this.deArmeCaC = undefined;
            this.deArmeDistance = undefined;
            this.deMunitions = undefined;
            return this.deArmeInhabituelle;
        }
    }

    getFromChance(armes: TablesChances, dice: number) {
        const arme = armes.Chances.filter(chance => (chance.lootChanceMin <= dice && chance.lootChanceMax >= dice))[0];
        this.nom = arme.name;
        this.prix += +(arme.price);
        this.currencyType = arme.currencyType;
    }

    setIsMunitions() {
        if (this.nom === 'Munitions' || this.deArmeDistance >= 91) {
            this.isMunitions = true;
            this.type = 'Munitions';
        }
    }

    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
            this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }
}
