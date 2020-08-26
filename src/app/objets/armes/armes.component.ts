import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';
import {
    Arme,
    CategoriesArmes, DegatsParTaille,
    MagicalProperty, Materiau,
    SortedMagicalProperty,
    TablesChances
} from '../../interface/MonstreGroupe';

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

    allProprietesMagiques: SortedMagicalProperty;
    allArmesSpeciales: SortedMagicalProperty;


    categorieArme: string;
    arme: Arme;
    taille: DegatsParTaille;
    nomTaille: string;
    materiau: Materiau;
    nomMateriau: string;

    deArme: number;
    Categories: number;

    allArmeCourantes: CategoriesArmes;
    allArmesGuerre: CategoriesArmes;
    allArmesExotiques: CategoriesArmes;
    allCategoriesCourante: CategoriesArmes;

    constructor(private http: HttpClient, private jsonService: JSonLoadService) {
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
            this.type = 'Arme de corp à corp';
        } else if (this.deTypeArme > 70 && this.deTypeArme <= 90) {
            this.isDistance = true;
            this.type = 'Arme a distance';
        } else if (this.deTypeArme > 90 && this.deTypeArme <= 100) {
            this.isInhabituelle = true;
            this.type = 'Arme inhabituelle';
        }
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

    setBonus(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        console.log(data.indexOf(data.filter(f => f === 'Prix')[0]));
        console.log(data[indexPrix]);
        if (!isNaN(+data[indexPrix].replace('bonus de +', '').replace('.', ''))) {
            this.bonus += +data[indexPrix].replace('bonus de +', '').replace('.', '');
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
        if (this.deArmeSpeciale && this.deArmeSpeciale <= this.getNbProprietesMagiques(this.allArmesSpeciales)) {
            const armeSpecial: MagicalProperty = JSON.parse(JSON.stringify(
                this.getPropretesMagiques(this.allArmesSpeciales)[this.deArmeSpeciale - 1])) as MagicalProperty;
            this.type = 'Arme speciale';
            this.bonus = 0;
            this.proprietesMagiques.push(armeSpecial);
            this.nom = armeSpecial.title;
            this.getPrixAndCurrency(armeSpecial.infos.data);
        }
    }

    getPrixAndCurrency(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        const match = data[indexPrix].match(/([0-9]+ )+/)[0];
        this.prix = +match.replace(' ', '');
        this.currencyType = data[indexPrix].replace(match, '')
            .replace(' ', '').replace('.', '');
    }

    getNbProprietesMagiques(proprietesMagiques: SortedMagicalProperty): number {
        return this.getPropretesMagiques(proprietesMagiques).length;
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
        return this.isSpeciale ? ''
            : this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title
                : this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
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
        this.nomMateriau = null;
        this.nomTaille = null;
        this.materiau = null;
        this.taille = null;
        this.arme = this.allCategoriesCourante.Categories.find(f => f.title === this.categorieArme).armes[this.deArme - 1];
    }

    getNbArme() {
        return this.allCategoriesCourante.Categories.find(f => f.title === this.categorieArme).armes.length;
    }

    setAllArmesCourantes() {
        this.deArme = null;
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
    }

    getNomsTailles() {
        return this.arme.degatsParTaille.map(f => f.taille);
    }

    getTailles() {
        return this.arme.degatsParTaille;
    }

    getNbTailleArme() {
        // console.log(this.arme);
        return this.arme.degatsParTaille.length;
    }

    setMateriau() {
        this.materiau = this.arme.autresMateriaux.find(f => f.nom.replace(/<a.*>(.*)<\/a>/, '$1') === this.nomMateriau);
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
}
