import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleAndMonstreService} from '../services/famille-and-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';
import {ObjetSimpleComponent} from '../creationObjets/objet-simple/objet-simple.component';
import {ArmesComponent} from '../creationObjets/armes/armes.component';
import {ArmuresComponent} from '../creationObjets/armures/armures.component';
import {ObjetService} from '../services/objet.service';
import {PersonnageService} from '../services/personnage.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';

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
    input2: number;
    input3: number;
    deDeDrop: number;
    parametres: string[];
    /* Paramètres en cas de double objet */
    parametres2: string[];
    /* Paramètres du deuxième objet en cas de double objet */
    parametres3: string[];

    armure: ArmuresComponent;
    arme: ArmesComponent;
    objetSimple: ObjetSimpleComponent;

    personnages: Personnage[];
    personnageCourant: Personnage;
    idPersonnageSelectionne = 0;


    async ngOnInit() {
        this.chargerFamilles(this.http);
        const response: SpecialResponse = await this.monstreLootChance.getLootPossibles(this.http);
        console.log(response);
        this.lootPossible = response.data as Loot[];
        this.personnages = (await this.personnageService.getAllPersonnages(this.http, true)).data as Personnage[];
    }

    constructor(private http: HttpClient,
                private familleMonstre: FamilleAndMonstreService,
                private monstreLootChance: MonstreLootChanceService,
                private objetService: ObjetService,
                private personnageService: PersonnageService,
                public dialog: MatDialog) {
    }

    openDialog(): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.hasBackdrop = true;
        const dialogRef = this.dialog.open(DialogContentDialogComponent, dialogConfig);

        return dialogRef.afterClosed();
    }

    public chargerFamilles(http: HttpClient) {
        this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(http);
    }

    public async chargerMonstreLootChance() {
        this.monstreSelectionneLootChance = [];
        const response: SpecialResponse = await this.monstreLootChance.getMonstreLootChanceBis(this.http, this.monstreCourrant.idMonstre);
        console.log(response);
        this.monstreSelectionneLootChance = response.data as MonstreLootChanceBis[];
    }

    selectionMonstre($event: Monstre) {
        this.monstreCourrant = $event;
        this.monstreSelectionneLootChance = [];
        this.chargerMonstreLootChance();
    }

    selectionLoot(event: any) {
        if (+event.target.value > 20) {
            event.target.value = 20;
        } else if (+event.target.value < 0) {
            event.target.value = 0;
        } else if (isNaN(event.target.value)) {
            event.target.value = null;
            this.deDeDrop = null;
        }
        // this.deDeDrop = +event.target.value;
        this.lootSelectionne = this.monstreSelectionneLootChance.filter(lc => +lc.roll === this.deDeDrop)[0];
    }

    selectPersonnage() {
        if (+this.idPersonnageSelectionne !== 0) {
            this.personnageCourant = this.personnages.find(f => f.idPersonnage === +this.idPersonnageSelectionne);
        }
    }

    public isObjet(): boolean {
        // this.setParametres();
        return this.lootSelectionne && (this.lootSelectionne.idLoot === 6 || this.isObjetMaudit());
    }

    public isObjetMaudit(): boolean {
        return this.lootSelectionne && (this.lootSelectionne.idLoot === 1);
    }

    public isDoubleObjet() {
        return this.input1 >= 71 && this.input1 <= 80;
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
        } else if (objet === 'creationObjets' && this.input1 >= 71 && this.input1 <= 80) {
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

    isMeReduced(objet: string, isInput2: boolean) {
        let input;
        let parameter = null;
        let hasToBeTrue = false;
        if (isInput2) {
            input = this.input2;
        } else {
            input = this.input3;
        }
        if (objet === 'simple' && input && input <= 20) {
            parameter = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
            hasToBeTrue = true;
        } else if (objet === 'armes' && input >= 21 && input <= 35) {
            hasToBeTrue = true;
        } else if (objet === 'armures' && input >= 36 && input <= 50) {
            hasToBeTrue = true;
        } else if (objet === 'simple' && input >= 51 && input <= 65) {
            parameter = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
            hasToBeTrue = true;
        } else if (objet === 'simple' && input >= 65 && input <= 80) {
            parameter = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
            hasToBeTrue = true;
        } else if (objet === 'simple' && input >= 81 && input <= 100) {
            parameter = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
            hasToBeTrue = true;
        }
        if (isInput2) {
            this.parametres2 = parameter;
        } else {
            this.parametres3 = parameter;
        }
        return hasToBeTrue;
    }

    getObjetSimple($event: ObjetSimpleComponent) {
        if ($event) {
            this.armure = null;
            this.arme = null;
            this.objetSimple = $event;

            this.checkPersonnageAndSendObjet(this.objetSimple.castToObjetCommunForDB(this.idPersonnageSelectionne));
        }
    }

    getArme($event: ArmesComponent) {
        this.armure = null;
        this.arme = $event;
        this.objetSimple = null;

        this.checkPersonnageAndSendObjet(this.arme.castToObjetCommunForDB(this.idPersonnageSelectionne));
    }

    getArmure($event: ArmuresComponent) {
        this.armure = $event;
        this.arme = null;
        this.objetSimple = null;

        this.checkPersonnageAndSendObjet(this.armure.castToObjetCommunForDB(this.idPersonnageSelectionne));
    }

    checkPersonnageAndSendObjet(objetCommunDB: ObjetCommunForDB) {
        console.log(this.idPersonnageSelectionne);
        if (this.idPersonnageSelectionne === 0 || !this.idPersonnageSelectionne) {
            this.openDialog().subscribe(result => {
                console.log(`Dialog result: ${result}`);
                if (result) {
                    this.sendObjet(objetCommunDB);
                }
            });
        } else {
            this.sendObjet(objetCommunDB);
        }
    }

    async sendObjet(objetCommunDB: ObjetCommunForDB) {
        // On fait l'ajout de l'objet, puis de la propriété magique, puis des tables, puis des ul.
        // Car sinon, il y a trop de données, et on a une erreur :
        // CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource
        const objetCommunDBModified: ObjetCommunForDB = JSON.parse(JSON.stringify(objetCommunDB)) as ObjetCommunForDB;
        objetCommunDBModified.proprieteMagique = null;
        const response: SpecialResponse = await this.objetService.envoyerObjetComplet(this.http, 'POST', null, objetCommunDBModified);
        console.log(response);
        const objet: ObjetCommunForDB = response.data as ObjetCommunForDB;
        const idObjet = objet.idObjet;
        console.log(idObjet);
        // this.ajouterMateriau(idObjet, this.armure.materiau);
        // this.ajouterMalediction(idObjet, this.armure.malediction);
        // Obligé de faire comme ça, alors que tout d'un coup marche, sinon erreur ... cf : voir au dessus
        await this.ajouterProprietesMagiques(idObjet, objetCommunDB.proprieteMagique);
    }

    async ajouterProprietesMagiques(idObjet: number, proprietesMagiques: MagicalProperty[]) {
        for (const proprieteMagique of proprietesMagiques) {
            const response: SpecialResponse = await this.objetService
                .envoyerEffetMagique(this.http, 'POST', idObjet, proprieteMagique);
            console.log(response);
        }
    }
}

@Component({
    selector: 'app-dialog-content-dialog',
    template: '<h2 mat-dialog-title>Validation</h2>\n' +
        '<mat-dialog-content class="mat-typography">\n' +
        '  <h3>Personnage sélectionné vide</h3>\n' +
        '  <p>Aucune personnage sélectionné. Êtes-vous sûr de ce choix ?</p>\n' +
        '</mat-dialog-content>\n' +
        '<mat-dialog-actions style="text-align: end">\n' +
        '  <button class="btn btn-danger btn-validation-dialog" [mat-dialog-close]="false">Annuler</button>\n' +
        '  <button class="btn btn-success btn-validation-dialog" [mat-dialog-close]="true">Valider</button>\n' +
        '</mat-dialog-actions>',
    styles: ['.btn-validation-dialog { background: transparent; margin-right: 5px; color: black; }'],
})
export class DialogContentDialogComponent {}
