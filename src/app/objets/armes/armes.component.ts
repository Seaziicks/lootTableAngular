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
    bonusArme: number;
    typeArme: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;

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
                    this.bonusArme = 1;
                } else if (this.deBonus > 70 && this.deBonus <= 85) {
                    this.bonusArme = 2;
                } else if (this.deBonus > 85 && this.deBonus <= 90) {
                    this.bonusArme = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 90 && this.deBonus <= 100) {
                    this.bonusArme = 0;
                    this.isMagique = true;
                }
                break;
            case 2:
                if (this.deBonus <= 10) {
                    this.bonusArme = 1;
                } else if (this.deBonus > 10 && this.deBonus <= 29) {
                    this.bonusArme = 2;
                } else if (this.deBonus > 29 && this.deBonus <= 58) {
                    this.bonusArme = 3;
                } else if (this.deBonus > 58 && this.deBonus <= 62) {
                    this.bonusArme = 4;
                } else if (this.deBonus > 62 && this.deBonus <= 68) {
                    this.bonusArme = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 68 && this.deBonus <= 100) {
                    this.bonusArme = 0;
                    this.isMagique = true;
                }
                break;
            case 3:
                if (this.deBonus <= 20) {
                    this.bonusArme = 3;
                } else if (this.deBonus > 20 && this.deBonus <= 38) {
                    this.bonusArme = 4;
                } else if (this.deBonus > 38 && this.deBonus <= 49) {
                    this.bonusArme = 5;
                } else if (this.deBonus > 49 && this.deBonus <= 63) {
                    this.bonusArme = 0;
                    this.isSpeciale = true;
                } else if (this.deBonus > 63 && this.deBonus <= 100) {
                    this.bonusArme = 0;
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
            this.typeArme = 'Armes de corp à corp';
        } else if (this.deTypeArme > 70 && this.deTypeArme <= 90) {
            this.isDistance = true;
            this.typeArme = 'Armes à distance';
        } else if (this.deTypeArme > 90 && this.deTypeArme <= 100) {
            this.isInhabituelle = true;
            this.typeArme = 'Armes inhabituelle';
        }
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.proprietesMagiques.push(this.allProprietesMagiques[this.deProprieteMagique - 1]);
    }

    getArmeSpeciale() {
        this.deProprieteMagique = undefined;
        this.deTypeArme = undefined;
        this.deArmeCaC = undefined;
        this.deArmeDistance = undefined;
        this.deArmeInhabituelle = undefined;
        this.deMunitions = undefined;
        this.resetArme();
        const armeSpecial: MagicalProperty = this.allArmesSpeciales[this.deArmeSpeciale - 1];
        this.typeArme = 'Speciale';
        this.bonusArme = 0;
        this.proprietesMagiques.push(armeSpecial);
        this.nom = armeSpecial.title;
    }

    getNbProprietesMagiques(): number {
        return this.allProprietesMagiques.length;
    }

    getNbArmesSpeciales(): number {
        return this.allArmesSpeciales.length;
    }

    resetArme() {
        this.proprietesMagiques = [];
        this.typeArme = undefined;
        this.bonusArme = undefined;
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
    }

    setIsMunitions() {
        if (this.nom === 'Munitions' || this.deArmeDistance >= 91) {
            this.isMunitions = true;
            this.typeArme = 'Munitions';
        }
    }

    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
            this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }
}
