import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleAndMonstreService} from '../services/famille-and-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';
import {
    Loot,
    MagicalProperty, Malediction,
    Materiau,
    Monstre,
    MonstreGroupe,
    MonstreLootChanceBis,
    Objet, ObjetCommunDB
} from '../interface/MonstreGroupe';
import {ObjetSimpleComponent} from '../objets/objet-simple/objet-simple.component';
import {ArmesComponent} from '../objets/armes/armes.component';
import {ArmuresComponent} from '../objets/armures/armures.component';
import {ObjetService} from '../services/objet.service';

export interface SpecialResponse {
    status: number;
    status_message: string;
    data: any;
}


@Component({
    selector: 'app-loot-table',
    templateUrl: './loot-table.component.html',
    styleUrls: ['./loot-table.component.scss']
})
export class LootTableComponent implements OnInit {

    monstresGroupes: MonstreGroupe[];
    monstreCourrant: Monstre;
    monstreSelectionneLootChance: MonstreLootChanceBis[];
    lootSelectionne: MonstreLootChanceBis;
    lootPossible: Loot[] = [];
    input1: number = null;
    deDeDrop: number;
    parametres: string[];

    armure: ArmuresComponent;
    arme: ArmesComponent;
    objetSimple: ObjetSimpleComponent;


    ngOnInit(): void {
        this.chargerFamilles(this.http);
        this.monstreLootChance.getLootPossibles(this.http).then(
            (data: any) => {
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                this.lootPossible = response.data as Loot[];
            }
        );
    }

    constructor(private http: HttpClient,
                private familleMonstre: FamilleAndMonstreService,
                private monstreLootChance: MonstreLootChanceService,
                private objetService: ObjetService) {
    }

    public chargerFamilles(http: HttpClient) {
        this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(http);
    }

    public chargerMonstreLootChance() {
        this.monstreSelectionneLootChance = [];
        this.monstreLootChance.getMonstreLootChanceBis(this.http, this.monstreCourrant.idMonstre).then(
            (data: any) => {
                const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
                this.monstreSelectionneLootChance = response.data as MonstreLootChanceBis[];
            });
    }

    selectionMonstre($event: Monstre) {
        this.monstreCourrant = $event;
        this.monstreSelectionneLootChance = [];
        this.chargerMonstreLootChance();
    }

    selectionLoot(event: any) {
        if (+event.target.value > 20) {
            event.target.value = 20;
        }
        this.deDeDrop = +event.target.value;
        this.lootSelectionne = this.monstreSelectionneLootChance.filter(lc => +lc.roll === this.deDeDrop)[0];
    }

    public isObjet(): boolean {
        this.setParametres();
        return this.lootSelectionne && (this.lootSelectionne.idLoot === 6 || this.isObjetMaudit());
    }

    public isObjetMaudit(): boolean {
        return this.lootSelectionne && (this.lootSelectionne.idLoot === 1);
    }

    public isDoubleObjet() {
        return this.input1 >= 80 && this.input1 <= 90;
    }

    public isRecompenseValide(): boolean {
        if (!(this.deDeDrop && this.lootSelectionne)) {
            return false;
        }
        switch (+this.lootSelectionne.idLoot) {
            case 2:
            case 3:
            case 4:
            case 5:
                return this.input1 != null;
        }
    }

    public getRecompense() {
        switch (this.lootSelectionne.idLoot) {
            case 2:
                return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces de cuivre.';
            case 3:
                return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'argent.';
            case 4:
                return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'or.';
            case 5:
                return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'or.';
        }
    }

    public getRecompenseValue() {
        switch (this.lootSelectionne.idLoot) {
            case 2:
            case 3:
            case 4:
            case 5:
                return this.input1 * this.lootSelectionne.multiplier;
        }
    }

    lootSelectionneNom(): string {
        return this.lootPossible.filter(lp => lp.idLoot === this.lootSelectionne.idLoot)[0].libelle;
    }

    isMe(objet: string) {
        if (objet === 'simple' && this.input1 && this.input1 <= 20) {
            this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
            return true;
        } else if (objet === 'armes' && this.input1 >= 21 && this.input1 <= 35) {
            return true;
        } else if (objet === 'armures' && this.input1 >= 36 && this.input1 <= 50) {
            return true;
        } else if (objet === 'simple' && this.input1 >= 51 && this.input1 <= 60) {
            this.parametres = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
            return true;
        } else if (objet === 'simple' && this.input1 >= 61 && this.input1 <= 70) {
            this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
            return true;
        } else if (objet === 'objets' && this.input1 >= 71 && this.input1 <= 80) {
            return true;
        } else if (objet === 'simple' && this.input1 >= 81 && this.input1 <= 100) {
            this.parametres = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
            return true;
        }
        return false;
    }

    setParametres() {
        if (this.input1 && this.input1 <= 20) {
            this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
        } else if (this.input1 >= 51 && this.input1 <= 60) {
            this.parametres = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
        } else if (this.input1 >= 61 && this.input1 <= 70) {
            this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        } else if (this.input1 >= 81 && this.input1 <= 100) {
            this.parametres = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
        }
    }

    isMeReduced(objet: string) {
        if (objet === 'simple' && this.input1 && this.input1 <= 20) {
            this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
            return true;
        } else if (objet === 'armes' && this.input1 >= 21 && this.input1 <= 35) {
            return true;
        } else if (objet === 'armures' && this.input1 >= 36 && this.input1 <= 50) {
            return true;
        } else if (objet === 'simple' && this.input1 >= 51 && this.input1 <= 65) {
            this.parametres = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
            return true;
        } else if (objet === 'simple' && this.input1 >= 65 && this.input1 <= 80) {
            this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
            return true;
        } else if (objet === 'simple' && this.input1 >= 81 && this.input1 <= 100) {
            this.parametres = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
            return true;
        }
        return false;
    }

    getObjetSimple($event: ObjetSimpleComponent) {
        if ($event) {
            this.armure = null;
            this.arme = null;
            this.objetSimple = $event;

            this.sendObjet(this.objetSimple.castToObjetCommunDB());
        }
    }

    getArme($event: ArmesComponent) {
        this.armure = null;
        this.arme = $event;
        this.objetSimple = null;

        this.sendObjet(this.arme.castToObjetCommunDB());
    }

    getArmure($event: ArmuresComponent) {
        this.armure = $event;
        this.arme = null;
        this.objetSimple = null;

        this.sendObjet(this.armure.castToObjetCommunDB());
    }

    sendObjet(objetCommunDB: ObjetCommunDB) {
        const objetCommunDBModified: ObjetCommunDB = JSON.parse(JSON.stringify(objetCommunDB)) as ObjetCommunDB;
        objetCommunDBModified.proprieteMagique = null;
        this.objetService.envoyerObjetComplet(this.http, 'POST', null, objetCommunDBModified).then(
            (dataObjet: any) => {
                console.log(dataObjet);
                const response = JSON.parse(dataObjet) as SpecialResponse;
                const objet: ObjetCommunDB = response.data as ObjetCommunDB;
                const idObjet = objet.idObjet;
                console.log(idObjet);
                // this.ajouterMateriau(idObjet, this.armure.materiau);
                // this.ajouterMalediction(idObjet, this.armure.malediction);
                this.ajouterProprietesMagiques(idObjet, objetCommunDB.proprieteMagique);
            }
        );
    }

    ajouterProprietesMagiques(idObjet: number, proprietesMagiques: MagicalProperty[]) {
        for (const proprieteMagique of proprietesMagiques) {
            this.objetService.envoyerEffetMagique(this.http, 'POST', idObjet, proprieteMagique).then(
                (data: any) => {
                    console.log(data);
                }
            );
        }
    }
}
