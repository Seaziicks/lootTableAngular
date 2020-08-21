import {Component, OnInit} from '@angular/core';
import {MagicalProperty} from '../../test-load-json/test-load-json.component';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';

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

    deBonus: number;
    dePuissance: number;
    deProprieteMagique: number;
    deArmeSpeciale: number;
    deTypeArme: number;
    deArmeCaC: number;
    deArmeDistance: number;
    deArmeInhabituelle: number;

    isSpeciale = false;
    isMagique = false;
    isCaC = false;
    isDistance = false;
    isInhabituelle = false;

    allProprietesMagiques: MagicalProperty[] = [];
    allArmesSpeciales: MagicalProperty[] = [];

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'effetsMagiquesArmes').then(
            (effetsMagiquesArmes: any) => {
                this.allProprietesMagiques = JSON.parse(effetsMagiquesArmes) as MagicalProperty[];
                console.log(this.allProprietesMagiques[0]);
                this.jsonService.getJSON('magique', 'armesSpeciales').then(
                    (armesSpeciales: any) => {
                        this.allArmesSpeciales = JSON.parse(armesSpeciales) as MagicalProperty[];
                        console.log(this.allArmesSpeciales[0]);
                    }
                );
            }
        );
    }

    setBonusArme() {
        this.isSpeciale = false;
        this.isMagique = false;
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
        if (this.deTypeArme <= 70) {
            this.isCaC = true;
            this.typeArme = 'de corp à corp';
        } else if (this.deTypeArme > 70 && this.deTypeArme <= 90) {
            this.isDistance = true;
            this.typeArme = 'à distance';
        } else if (this.deTypeArme > 90 && this.deTypeArme <= 100) {
            this.isInhabituelle = true;
            this.typeArme = 'inhabituelle';
        }
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.proprietesMagiques.push(this.allProprietesMagiques[this.deProprieteMagique]);
    }

    getArmeSpeciale() {
        this.resetArme();
        const armeSpecial: MagicalProperty = this.allArmesSpeciales[this.deArmeSpeciale];
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
    }


}
