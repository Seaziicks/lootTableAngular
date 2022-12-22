import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ObjetService} from '../../services/objet.service';
import {HttpClient} from '@angular/common/http';
import {SpecialResponse} from '../../loot-table/loot-table.component';
import {HttpMethods} from '../../interface/http-methods.enum';

import * as equal from 'fast-deep-equal';

@Component({
    selector: 'app-personnage-objet',
    templateUrl: './personnage-objet.component.html',
    styleUrls: ['./personnage-objet.component.scss']
})
export class PersonnageObjetComponent implements OnInit {

    @Input() personnages: Personnage[];
    @Input() personnageCourant: Personnage;

    @Input() set idObj(id: number) {
        this.idObjet = id;
        this.valide = false;
        this.modificationEnCours = false;
        this.loadObjet();
        this.idPersonnageSelectionne = this.personnageCourant.idPersonnage;
    }

    @Output() changingObjet = new EventEmitter<any>();

    idObjet: number;
    idPersonnageSelectionne: number;

    objet: ObjetCommunFromDB;
    objetOriginal: ObjetCommunFromDB;

    modificationEnCours = false;
    valide = false;

    updating = false;

    constructor(private http: HttpClient,
                private objetService: ObjetService) {
    }

    ngOnInit(): void {
    }

    async loadObjet() {
        const response: SpecialResponse = await this.objetService.getObjetComplet(this.http, this.idObjet);
        console.log(response);
        this.objet = response.data as ObjetCommunFromDB;
        this.objetOriginal = JSON.parse(JSON.stringify(this.objet)) as ObjetCommunFromDB;
        console.log(this.objet);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.modificationEnCours && event.key === 'Enter' && event.ctrlKey) {
            this.modifierContenu();
        }
    }

    trackByFn(index, item) {
        return index;
    }

    modifierContenu() {
        this.modificationEnCours = !this.modificationEnCours;
        // this.checkProprietesMagiquesIntegrity();
    }

    resetContenu() {
        this.objet = JSON.parse(JSON.stringify(this.objetOriginal)) as ObjetCommunFromDB;
    }

    selection() {
        this.valide = !this.valide;
        if (this.valide && JSON.stringify(this.objetOriginal) !== JSON.stringify(this.objet)) {
            this.updating = true;
            this.updateObjet();
            this.changingObjet.emit(this.objet.idObjet);
            setTimeout(() => {
                this.loadObjet();
            }, 1250);
            setTimeout(() => {
                this.updating = false;
                this.valide = false;
                this.modificationEnCours = false;
            }, 2500);
        }
    }

    selectPersonnageAChanger() {
        console.log(this.personnageCourant.idPersonnage);
        console.log(this.objet.idPersonnage);
        this.objet.idPersonnage = +this.idPersonnageSelectionne;
    }

    isProprietaire(idPersonnage: number): boolean {
        console.log((+this.personnageCourant.idPersonnage === +idPersonnage) + '(' + idPersonnage + ')');
        return +idPersonnage === +this.personnageCourant.idPersonnage;
    }

    checkProprietesMagiquesIntegrity() {
        for (let i = 0; i < this.objet.effetMagique.length; i++) {
            for (let indexDescription = 0;
                 indexDescription < this.objet.effetMagique[i].effetMagiqueDescription.length; indexDescription++) {
                if (this.objet.effetMagique[i].effetMagiqueDescription[indexDescription].contenu.length === 0) {
                    this.objet.effetMagique[i].effetMagiqueDescription.splice(indexDescription, 1);
                    indexDescription--;
                }
            }
            if (this.objet.effetMagique[i].effetMagiqueTable) {
                for (let indexTable = 0; indexTable < this.objet.effetMagique[i].effetMagiqueTable.length; indexTable++) {
                    for (let indexTableTitle = 0; indexTableTitle <
                    this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTitle.length; indexTableTitle++) {
                        for (let indexTableTitleContent = 0; indexTableTitleContent <
                        this.objet.effetMagique[i].effetMagiqueTable[indexTable]
                            .effetMagiqueTableTitle[indexTableTitle].effetMagiqueTableTitleContent.length; indexTableTitleContent++) {
                            if
                            (this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTitle[indexTableTitle]
                                .effetMagiqueTableTitleContent[indexTableTitleContent].contenu.length === 0) {
                                this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTitle[indexTableTitle]
                                    .effetMagiqueTableTitleContent.splice(indexTableTitleContent, 1);
                                indexTableTitleContent--;
                            }
                        }
                        if (this.objet.effetMagique[i].effetMagiqueTable[indexTable]
                            .effetMagiqueTableTitle[indexTableTitle].effetMagiqueTableTitleContent.length === 0) {
                            this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTitle.splice(indexTableTitle, 1);
                            indexTableTitle--;
                        }
                    }
                    for (let indexTableTr = 0; indexTableTr <
                    this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTr.length; indexTableTr++) {
                        for (let indexTableTrContent = 0; indexTableTrContent <
                        this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTableTr]
                            .effetMagiqueTableTrContent.length; indexTableTrContent++) {
                            if (this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTableTr]
                                .effetMagiqueTableTrContent[indexTableTrContent].contenu.length === 0) {
                                this.objet.effetMagique[i].effetMagiqueTable[indexTable]
                                    .effetMagiqueTableTr[indexTableTr].effetMagiqueTableTrContent.splice(indexTableTrContent, 1);
                                indexTableTrContent--;
                            }
                        }
                        if (this.objet.effetMagique[i].effetMagiqueTable[indexTable]
                            .effetMagiqueTableTr[indexTableTr].effetMagiqueTableTrContent.length === 0) {
                            this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTr.splice(indexTableTr, 1);
                            indexTableTr--;
                        }
                    }
                    if (this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTitle.length === 0
                        && this.objet.effetMagique[i].effetMagiqueTable[indexTable].effetMagiqueTableTr.length === 0) {
                        this.objet.effetMagique[i].effetMagiqueTable.splice(indexTable, 1);
                        indexTable--;
                    }
                }
            }
            if (this.objet.effetMagique[i].effetMagiqueUl) {
                for (let indexUl = 0; indexUl < this.objet.effetMagique[i].effetMagiqueUl.length; indexUl++) {
                    for (let indexLi = 0; indexLi < this.objet.effetMagique[i]
                        .effetMagiqueUl[indexUl].effetMagiqueUlContent.length; indexLi++) {
                        if (this.objet.effetMagique[i].effetMagiqueUl[indexUl].effetMagiqueUlContent[indexLi].contenu.length === 0) {
                            this.objet.effetMagique[i].effetMagiqueUl[indexUl].effetMagiqueUlContent.splice(indexLi, 1);
                            indexLi--;
                        }
                    }
                    if (this.objet.effetMagique[i].effetMagiqueUl.length === 0) {
                        this.objet.effetMagique[i].effetMagiqueUl.splice(indexUl, 1);
                        indexUl--;
                    }
                }
            }

            for (let indexInfos = 0;
                 indexInfos < this.objet.effetMagique[i].effetMagiqueDBInfos.length; indexInfos++) {
                if (this.objet.effetMagique[i].effetMagiqueDBInfos[indexInfos].contenu.length === 0) {
                    this.objet.effetMagique[i].effetMagiqueDBInfos.splice(indexInfos, 1);
                    indexInfos--;
                }
            }

            if (this.objet.materiau) {
                if (this.objet.materiau.effet.length === 0 && this.objet.materiau.nom.length === 0) {
                    this.objet.materiau = null;
                }
            }

            if (this.objet.malediction) {
                if (this.objet.malediction.description.length === 0 && this.objet.malediction.nom.length === 0) {
                    this.objet.malediction = null;
                }
            }

            if (this.objet.effetMagique[i].effetMagiqueDescription.length === 0
                && !this.objet.effetMagique[i].effetMagiqueTable
                && !this.objet.effetMagique[i].effetMagiqueUl) {
                console.log('Suppression de la propriete magique :' + this.objet.effetMagique[i].title);
                this.objet.effetMagique.splice(i, 1);
                i--;
            }
        }
    }

    changeValidation(name: string) {
        switch (name.toLowerCase()) {
            case 'nom':
                this.objet.afficherNom = !this.objet.afficherNom;
                break;
            case 'effetmagique':
                this.objet.afficherEffetMagique = !this.objet.afficherEffetMagique;
                break;
            case 'malediction':
                this.objet.afficherMalediction = !this.objet.afficherMalediction;
                break;
            case 'materiau':
                this.objet.afficherMateriau = !this.objet.afficherMateriau;
                break;
            case 'infos':
                this.objet.afficherInfos = !this.objet.afficherInfos;
                break;

        }
        this.areDifferentObjets(this.objet, this.objetOriginal);
    }

    // Ne gère que l'update. La suppression sera à gérer dans la fonction checkProprietesMagiquesIntegrity.
    // Ça sera plus simple.
    // Ou alors, il ne faut mettre à jour la supression que quand on valide l'objet.
    // Et ne plus utiliser checkProprietesMagiquesIntegrity, ce qui serait plus simple.
    // Sinon, on ne sait pas quelle ligne supprimer.
    async updateObjet() {
        this.setEmptyToNull();
        if (this.isEmptyObjet()) {
            // TODO : Supprimer objet
            const response: SpecialResponse = await this.objetService.objet(this.http, HttpMethods.DELETE, 0, this.objet);
            console.log(response);
        } else {
            for (let indexEffet = 0; indexEffet < this.objet.effetMagique.length; indexEffet++) {
                if (this.isEmptyEffetMagique(this.objet.effetMagique[indexEffet])) {
                    // TODO : Supprimer effet
                    const response: SpecialResponse = await this.objetService
                        .effetMagique(this.http, HttpMethods.DELETE, 0, this.objet.effetMagique[indexEffet]);
                    console.log(response);
                } else {
                    // Gestion des tables de l'effet magique.
                    for (let indexTable = 0; indexTable < this.objet.effetMagique[indexEffet].effetMagiqueTable.length; indexTable++) {
                        if (this.isEmptyTable(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable])) {
                            // TODO : Supprimer table
                            const response: SpecialResponse = await this.objetService.table(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]);
                            console.log(response);
                        } else {
                            if (this.areDifferentTables(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable])) {
                                // TODO : Modifier la table
                                const response: SpecialResponse = await this.objetService.table(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]);
                                console.log(response);
                            }
                            // Gestion des tables title de la table.
                            for (let indexTitle = 0;
                                 indexTitle < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                     .effetMagiqueTableTitle.length;
                                 indexTitle++) {
                                if (this.isEmptyTableTitle(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                    .effetMagiqueTableTitle[indexTitle])) {
                                    // TODO : Supprimer title
                                    const response: SpecialResponse = await this.objetService.title(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle]);
                                    console.log(response);
                                } else {
                                    if (this.areDifferentTableTitles(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle],
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle])) {
                                        // TODO : Modifier title
                                        const response: SpecialResponse = await this.objetService.title(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTitle[indexTitle]);
                                        console.log(response);
                                    }
                                    // Gestion des table title content
                                    for (let indexTitleContent = 0;
                                         indexTitleContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                             .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent.length;
                                         indexTitleContent++) {
                                        if (this.isEmptyTableTitleContent(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent[indexTitleContent])) {
                                            // TODO : Supprimer title content
                                            const response: SpecialResponse = await this.objetService
                                                .titleContent(this.http, HttpMethods.DELETE, 0,
                                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                        .effetMagiqueTableTitle[indexTitle]
                                                        .effetMagiqueTableTitleContent[indexTitleContent]);
                                            console.log(response);
                                        } else {
                                            if (this.areDifferentTableTitleContents(this.objet.effetMagique[indexEffet]
                                                    .effetMagiqueTable[indexTable].effetMagiqueTableTitle[indexTitle]
                                                    .effetMagiqueTableTitleContent[indexTitleContent],
                                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTitle[indexTitle]
                                                    .effetMagiqueTableTitleContent[indexTitleContent])) {
                                                // TODO : Modifier title content
                                                const response: SpecialResponse = await this.objetService
                                                    .titleContent(this.http, HttpMethods.PUT, 0,
                                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                            .effetMagiqueTableTitle[indexTitle]
                                                            .effetMagiqueTableTitleContent[indexTitleContent]);
                                                console.log(response);
                                            }
                                        }
                                    }
                                }
                            }
                            // Gestion des table tr de la table en cours de l'effet magique
                            for (let indexTr = 0;
                                 indexTr < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr.length;
                                 indexTr++) {
                                let tableTrIndex: number;
                                if (indexTr >=
                                    this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr.length) {
                                    // TODO : Ajouter tr
                                    const response: SpecialResponse = await this.objetService.tr(this.http, HttpMethods.POST,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].idEffetMagiqueTable,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]);
                                    tableTrIndex = (response.data as unknown as EffetMagiqueTableTr).idEffetMagiqueTableTr;
                                    console.log(response);
                                } else if (this.isEmptyTableTr(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                    .effetMagiqueTableTr[indexTr])) {
                                    // TODO : Supprimer tr
                                    const response: SpecialResponse = await this.objetService.tr(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]);
                                    console.log(response);
                                } else {
                                    if (this.areDifferentTableTrs(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr],
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr])) {
                                        // TODO : Modifier tr
                                        const response: SpecialResponse = await this.objetService.tr(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]);
                                        console.log(response);
                                    }
                                }
                                // Gestion des table tr content de la table en cours de l'ffet magique
                                for (let indexTrContent = 0;
                                     indexTrContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                         .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent.length;
                                     indexTrContent++) {
                                    if (indexTr >=
                                        // tslint:disable-next-line:max-line-length
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr.length) {
                                        // TODO : Ajouter tr content sur un nouveau tr
                                        const response: SpecialResponse = await this.objetService
                                            .trContent(this.http, HttpMethods.POST, tableTrIndex,
                                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]);
                                        console.log(response);
                                    } else if (indexTrContent >=
                                        // tslint:disable-next-line:max-line-length
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent.length) {
                                        // TODO : Ajouter tr content sur tr déjà existant
                                        tableTrIndex = this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr].idEffetMagiqueTableTr;
                                        const response: SpecialResponse = await this.objetService
                                            .trContent(this.http, HttpMethods.POST, tableTrIndex,
                                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]);
                                        console.log(response);
                                    } else if (this.isEmptyTableTrContent(this.objet.effetMagique[indexEffet]
                                        .effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]
                                        .effetMagiqueTableTrContent[indexTrContent])) {
                                        // TODO : Supprimer tr content
                                        const response: SpecialResponse = await this.objetService
                                            .trContent(this.http, HttpMethods.DELETE, 0,
                                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]);
                                        console.log(response);
                                    } else {
                                        if (this.areDifferentTableTrContents(this.objet.effetMagique[indexEffet]
                                                .effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]
                                                .effetMagiqueTableTrContent[indexTrContent],
                                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent])) {
                                            // TODO : Modifier tr content
                                            const response: SpecialResponse = await this.objetService
                                                .trContent(this.http, HttpMethods.PUT, 0,
                                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                        .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]);
                                            console.log(response);
                                        }
                                    }
                                }

                            }
                        }
                    }

                    // Gestion des listes (uls) de l'effet magique
                    for (let indexUl = 0; indexUl < this.objet.effetMagique[indexEffet].effetMagiqueUl.length; indexUl++) {
                        if (this.isEmptyUl(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl])) {
                            // TODO : Supprimer ul
                            const response: SpecialResponse = await this.objetService.ul(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]);
                            console.log(response);
                        } else {
                            if (this.areDifferentUls(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl])) {
                                // TODO : Modifier ul
                                const response: SpecialResponse = await this.objetService.ul(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]);
                                console.log(response);
                            }
                            // Gestion des ul content de l'ul en cours de l'effet magique
                            for (let indexUlContent = 0;
                                 indexUlContent < this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl].effetMagiqueUlContent.length;
                                 indexUlContent++) {
                                if (indexUlContent >=
                                    this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl].effetMagiqueUlContent.length) {
                                    // TODO : Ajouter ul content (une ligne à une ul).
                                    const idEffetMagiqueUl = this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl].idEffetMagiqueUl;
                                    const response: SpecialResponse = await this.objetService.ulContent(this.http, HttpMethods.POST,
                                        idEffetMagiqueUl, this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                            .effetMagiqueUlContent[indexUlContent]);
                                    console.log('==================================================================');
                                    console.log('Ajout d\'une ligne de ul !');
                                    console.log(response);
                                } else if (this.isEmptyUlContent(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                    .effetMagiqueUlContent[indexUlContent])) {
                                    // TODO : Supprimer ul content
                                    const response: SpecialResponse = await this.objetService.ulContent(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                            .effetMagiqueUlContent[indexUlContent]);
                                    console.log(response);
                                } else {
                                    if (this.areDifferentUlContents(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                            .effetMagiqueUlContent[indexUlContent],
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                            .effetMagiqueUlContent[indexUlContent])) {
                                        // TODO : Modifier ul content
                                        console.log('Je modifie une valeur, car :' +
                                            this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                                .effetMagiqueUlContent[indexUlContent].contenu + ' !== ' +
                                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                                .effetMagiqueUlContent[indexUlContent].contenu);
                                        const response: SpecialResponse = await this.objetService.ulContent(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                                .effetMagiqueUlContent[indexUlContent]);
                                        console.log(response);
                                    }
                                }
                            }
                        }
                    }

                    // Gestion des description de l'effet magique. Chaque description est séparée par une table,
                    // et par une ul quand il n'y a plus de table
                    for (let indexDescription = 0; indexDescription < this.objet.effetMagique[indexEffet].effetMagiqueDescription.length;
                         indexDescription++) {
                        if (indexDescription >= this.objetOriginal.effetMagique[indexEffet].effetMagiqueDescription.length) {
                            const response: SpecialResponse = await this.objetService.description(this.http, HttpMethods.POST,
                                this.objetOriginal.effetMagique[indexEffet].idEffetMagique,
                                this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription]);
                            console.log(response);
                        } else if (this.isEmptyDescription(this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])) {
                            // TODO : Supprimer description
                            const response: SpecialResponse = await this.objetService.description(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription]);
                            console.log(response);
                        } else {
                            if (this.areDifferentDescriptions(this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])) {
                                // TODO : Modifier description
                                const response: SpecialResponse = await this.objetService.description(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription]);
                                console.log(response);
                            }
                        }
                    }

                    // Gestion des infos de l'effet magique. Plusieurs lignes pour résumer quelques infos distinctes,
                    // mais peu utiles, comme la puissance d'invocation, la méthode de création, le prix, etc ...
                    for (let indexInfos = 0; indexInfos < this.objet.effetMagique[indexEffet].effetMagiqueDBInfos.length;
                         indexInfos++) {
                        if (this.isEmptyInfo(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])) {
                            // TODO : Supprimer infos
                            const response: SpecialResponse = await this.objetService.infos(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos]);
                            console.log(response);
                        } else {
                            if (this.areDifferentInfos(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])) {
                                // TODO : Modifier infos
                                const response: SpecialResponse = await this.objetService.infos(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos]);
                                console.log(response);
                            }
                        }
                    }

                    // Comme tout le reste est géré avant (les descriptions, tables, ul et touti quanti),
                    // on ne regarde ici que  l'id et le titre.
                    if (this.areDifferentEffetsMagiques(this.objet.effetMagique[indexEffet], this.objetOriginal.effetMagique[indexEffet])) {
                        // TODO : Modifier effet
                        const response: SpecialResponse = await this.objetService
                            .effetMagique(this.http, HttpMethods.PUT, 0, this.objet.effetMagique[indexEffet]);
                        console.log(response);
                    }
                }
            }
            // Cette update, si elle se fait, ne va modifier que l'objet en lui même, avec les ids.
            // Mais pas les effets magiques associés.
            // Un problème semble tout de même subsister. La comparaison se fait avec les effets magiques complets,
            // pas seulement les ids ... Je ne sais que faire, car normalement, ça a été géré avant.
            if (this.areDifferentObjets(this.objet, this.objetOriginal)) {
                const response: SpecialResponse = await this.objetService.objet(this.http, HttpMethods.PUT, 0, this.objet);
                console.log(response);
            }
        }
    }

    setEmptyToNull() {
        this.objet.fauxNom = this.objet.fauxNom ? this.objet.fauxNom.length !== 0 ? this.objet.fauxNom : null : null;
        this.objet.nom = this.objet.nom ? this.objet.nom.length !== 0 ? this.objet.nom : null : null;
        this.objet.type = this.objet.type ? this.objet.type.length !== 0 ? this.objet.type : null : null;
        this.objet.degats = this.objet.degats ? this.objet.degats.length !== 0 ? this.objet.degats : null : null;
        this.objet.categorie = this.objet.categorie ? this.objet.categorie.length !== 0 ? this.objet.categorie : null : null;
        this.objet.critique = this.objet.critique ? this.objet.critique.length !== 0 ? this.objet.critique : null : null;
        this.objet.devise = this.objet.devise ? this.objet.devise.length !== 0 ? this.objet.devise : null : null;
        this.objet.facteurPortee = this.objet.facteurPortee ?
            this.objet.facteurPortee.length !== 0 ? this.objet.facteurPortee : null
            : null;
        this.objet.risqueEchecSorts = this.objet.risqueEchecSorts ?
            this.objet.risqueEchecSorts.length !== 0 ? this.objet.risqueEchecSorts : null
            : null;
        this.objet.taille = this.objet.taille ? this.objet.taille.length !== 0 ? this.objet.taille : null : null;
    }

    isEmptyTable(effetMagiqueTable: EffetMagiqueTable): boolean {
        for (const title of effetMagiqueTable.effetMagiqueTableTitle) {
            if (!this.isEmptyTableTitle(title)) {
                return false;
            }
        }
        for (const tr of effetMagiqueTable.effetMagiqueTableTr) {
            if (!this.isEmptyTableTr(tr)) {
                return false;
            }
        }
        return true;
    }

    isEmptyTableTitle(effetMagiqueTableTitle: EffetMagiqueTableTitle): boolean {
        for (const titleContent of effetMagiqueTableTitle.effetMagiqueTableTitleContent) {
            if (!this.isEmptyTableTitleContent(titleContent)) {
                return false;
            }
        }
        return true;
    }

    isEmptyTableTitleContent(effetMagiqueTableTitleContent: EffetMagiqueTableTitleContent): boolean {
        return effetMagiqueTableTitleContent.contenu.length === 0 || !(!!effetMagiqueTableTitleContent.contenu);
    }

    isEmptyTableTr(effetMagiqueTableTr: EffetMagiqueTableTr): boolean {
        for (const trContent of effetMagiqueTableTr.effetMagiqueTableTrContent) {
            if (!this.isEmptyTableTrContent(trContent)) {
                return false;
            }
        }
        return true;
    }

    isEmptyTableTrContent(effetMagiqueTableTrContent: EffetMagiqueTableTrContent): boolean {
        return !(!!effetMagiqueTableTrContent.contenu) || effetMagiqueTableTrContent.contenu.length === 0;
    }

    isEmptyUl(effetMagiqueUl: EffetMagiqueUl): boolean {
        for (const ulContent of effetMagiqueUl.effetMagiqueUlContent) {
            if (!this.isEmptyUlContent(ulContent)) {
                return false;
            }
        }
        return true;
    }

    isEmptyUlContent(effetMagiqueUlContent: EffetMagiqueUlContent): boolean {
        return effetMagiqueUlContent.contenu.length === 0;
    }

    isEmptyDescriptions(effetMagiqueDescriptions: EffetMagiqueDescription[]) {
        for (const description of effetMagiqueDescriptions) {
            if (!this.isEmptyDescription(description)) {
                return false;
            }
        }
        return true;
    }

    isEmptyDescription(description: EffetMagiqueDescription): boolean {
        return !(!!description.contenu) || description.contenu.length === 0;
    }

    isEmptyInfos(effetMagiqueInfos: EffetMagiqueDBInfos[]) {
        for (const infos of effetMagiqueInfos) {
            if (!this.isEmptyInfo(infos)) {
                return false;
            }
        }
        return true;
    }

    isEmptyInfo(info: EffetMagiqueDBInfos) {
        return !(!!info.contenu) || info.contenu.length === 0;
    }

    isEmptyEffetMagique(effetMagique: EffetMagiqueDB) {
        for (const table of effetMagique.effetMagiqueTable) {
            if (!this.isEmptyTable(table)) {
                return false;
            }
        }
        for (const ul of effetMagique.effetMagiqueUl) {
            if (!this.isEmptyUl(ul)) {
                return false;
            }
        }
        return this.isEmptyDescriptions(effetMagique.effetMagiqueDescription);
    }

    isEmptyObjet(): boolean {
        if (this.objet.nom.length !== 0
            || (this.objet.malediction && (this.objet.malediction.nom.length !== 0 || this.objet.malediction.description.length !== 0))
            || (this.objet.materiau && (this.objet.materiau.nom.length !== 0 || this.objet.materiau.effet.length !== 0))) {
            return false;
        }
        for (const effet of this.objet.effetMagique) {
            if (!this.isEmptyEffetMagique(effet)) {
                return false;
            }
        }
        return true;
    }

    areDifferentTables(table1: EffetMagiqueTable, table2: EffetMagiqueTable): boolean {
        return table1.idEffetMagique !== table2.idEffetMagique || table1.position !== table2.position;
    }

    areDifferentTableTitles(table1: EffetMagiqueTableTitle, table2: EffetMagiqueTableTitle): boolean {
        return table1.idEffetMagiqueTable !== table2.idEffetMagiqueTable;
    }

    areDifferentTableTitleContents(table1: EffetMagiqueTableTitleContent, table2: EffetMagiqueTableTitleContent): boolean {
        return table1.idEffetMagiqueTableTitle !== table2.idEffetMagiqueTableTitle || table1.contenu !== table2.contenu;
    }

    areDifferentTableTrs(table1: EffetMagiqueTableTr, table2: EffetMagiqueTableTr): boolean {
        return table1.idEffetMagiqueTable !== table2.idEffetMagiqueTable;
    }

    areDifferentTableTrContents(table1: EffetMagiqueTableTrContent, table2: EffetMagiqueTableTrContent): boolean {
        return table1.idEffetMagiqueTableTr !== table2.idEffetMagiqueTableTr || table1.contenu !== table2.contenu;
    }

    areDifferentUls(table1: EffetMagiqueUl, table2: EffetMagiqueUl): boolean {
        return table1.idEffetMagique !== table2.idEffetMagique || table1.position !== table2.position;
    }

    areDifferentUlContents(table1: EffetMagiqueUlContent, table2: EffetMagiqueUlContent): boolean {
        return table1.idEffetMagiqueUl !== table2.idEffetMagiqueUl || table1.contenu !== table2.contenu;
    }

    areDifferentDescriptions(description1: EffetMagiqueDescription, description2: EffetMagiqueDescription): boolean {
        return description1.idEffetMagique !== description2.idEffetMagique || description1.contenu !== description2.contenu;
    }

    areDifferentInfos(infos1: EffetMagiqueDBInfos, infos2: EffetMagiqueDBInfos): boolean {
        return infos1.idEffetMagique !== infos2.idEffetMagique || infos1.contenu !== infos2.contenu;
    }

    areDifferentEffetsMagiques(effet1: EffetMagiqueDB, effet2: EffetMagiqueDB): boolean {
        return effet1.idObjet !== effet2.idObjet || effet1.title !== effet2.title;
    }

    areDifferentObjets(objet1: ObjetCommunFromDB, objet2: ObjetCommunFromDB): boolean {
        const objetTemp1 = JSON.parse(JSON.stringify(objet1)) as ObjetCommunFromDB;
        // objetTemp1.effetMagique = null;
        // objetTemp1.materiau = null;
        // objetTemp1.malediction = null;
        const objetTemp2 = JSON.parse(JSON.stringify(objet2)) as ObjetCommunFromDB;
        // objetTemp2.effetMagique = null;
        // objetTemp2.materiau = null;
        // objetTemp2.malediction = null;

        // console.log(objetTemp1);
        // console.log(objetTemp2);
        // console.log(JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2));
        // console.log(!equal(objetTemp1, objetTemp2)); // true
        // return JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2);
        return !equal(objetTemp1, objetTemp2);
    }

    descriptionHasTableOrUlAfter(indexEffetMagique: number, indexDescription: number): boolean {
        for (const table of this.objet.effetMagique[indexEffetMagique].effetMagiqueTable) {
            if (indexDescription === table.position - 1) {
                return true;
            }
        }
        for (const ul of this.objet.effetMagique[indexEffetMagique].effetMagiqueUl) {
            if (indexDescription === ul.position - 1) {
                return true;
            }
        }
        return false;
    }

    ajouterDescription(indexEffetMagique: number, indexDescription: number) {
        // On récupère les index et on ajoute la description à l'endroit correspondant dans le tableau des descriptions.
        const addingIndex = indexDescription + 1;
        const newDescriptionIndex = this.objet.effetMagique[indexEffetMagique]
            .effetMagiqueDescription[addingIndex].idEffetMagiqueDescription;
        const idEffetMagique = this.objet.effetMagique[indexEffetMagique]
            .effetMagiqueDescription[addingIndex].idEffetMagique;

        if (this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription[indexDescription].contenu !== '') {
            this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription.splice(addingIndex, 0,
                {
                    contenu: '',
                    idEffetMagique,
                    idEffetMagiqueDescription: newDescriptionIndex
                } as EffetMagiqueDescription);

            console.log(this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription.length);
            // On déplace tous les index des descriptions qui arrivent après, sauf la dernière qui prend null.
            for (let i = addingIndex + 1; i < this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription.length - 1; i++) {
                this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription[i].idEffetMagiqueDescription =
                    this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription[i + 1].idEffetMagiqueDescription;
            }
            this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription[
            this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription.length - 1].idEffetMagiqueDescription = null;

            console.log(this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription);

            // On décale toutes les tables et toutes les listes éventuelles.
            for (const table of this.objet.effetMagique[indexEffetMagique].effetMagiqueTable) {
                if (table.position >= indexDescription) {
                    table.position++;
                }
            }
            for (const ul of this.objet.effetMagique[indexEffetMagique].effetMagiqueUl) {
                if (ul.position >= indexDescription) {
                    ul.position++;
                }
            }
            console.log(this.objet.effetMagique[indexEffetMagique].effetMagiqueDescription);
        }
    }

    ajouterLigneTable(indexEffetMagique: number, indexTable: number) {

        const idEffetMagiqueTable = this.objet.effetMagique[indexEffetMagique].effetMagiqueTable[indexTable].idEffetMagiqueTable;

        this.objet.effetMagique[indexEffetMagique].effetMagiqueTable[indexTable]
            .effetMagiqueTableTr.push({idEffetMagiqueTable, effetMagiqueTableTrContent: []} as EffetMagiqueTableTr);

        const tableLineNumber: number = this.objet.effetMagique[indexEffetMagique].effetMagiqueTable[indexTable]
            .effetMagiqueTableTr.length;

        // tslint:disable-next-line:max-line-length
        for (const line of this.objet.effetMagique[indexEffetMagique].effetMagiqueTable[indexTable].effetMagiqueTableTitle[0].effetMagiqueTableTitleContent) {
            this.objet.effetMagique[indexEffetMagique].effetMagiqueTable[indexTable]
                .effetMagiqueTableTr[tableLineNumber - 1].effetMagiqueTableTrContent
                .push({contenu: ''} as EffetMagiqueTableTrContent);
        }
    }

    ajouterLigneUl(indexEffetMagique: number, indexUl: number) {

        const idEffetMagiqueUl = this.objet.effetMagique[indexEffetMagique].effetMagiqueUl[indexUl].idEffetMagiqueUl;
        const listLength: number = this.objet.effetMagique[indexEffetMagique].effetMagiqueUl[indexUl].effetMagiqueUlContent.length;

        if (this.objet.effetMagique[indexEffetMagique].effetMagiqueUl[indexUl].effetMagiqueUlContent[listLength - 1].contenu !== '') {
            this.objet.effetMagique[indexEffetMagique].effetMagiqueUl[indexUl].effetMagiqueUlContent
                .push({idEffetMagiqueUl, contenu: ''} as EffetMagiqueUlContent);
        }
    }
}
