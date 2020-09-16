import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ObjetService} from '../services/objet.service';
import {HttpClient} from '@angular/common/http';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpMethods} from '../interface/http-methods.enum';

import * as equal from 'fast-deep-equal';

@Component({
    selector: 'app-personnage-objet',
    templateUrl: './personnage-objet.component.html',
    styleUrls: ['./personnage-objet.component.scss']
})
export class PersonnageObjetComponent implements OnInit {

    @Input() set idObj(id: number) { this.idObjet = id; this.valide = false; this.modificationEnCours = false; this.loadObjet(); }
    @Output() changingObjet = new EventEmitter<any>();

    idObjet: number;

    objet: ObjetCommunFromDB;
    objetOriginal: ObjetCommunFromDB;

    modificationEnCours = false;
    valide = false;

    updating = false;

    constructor(private http: HttpClient,
                private objetService: ObjetService) { }

    ngOnInit(): void {
    }

    loadObjet() {
        this.objetService.getObjetComplet(this.http, this.idObjet).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as ObjetCommunFromDB;
                this.objetOriginal = JSON.parse(JSON.stringify(this.objet)) as ObjetCommunFromDB;
                console.log(this.objet);
            }
        );
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
            setTimeout( () => { this.loadObjet(); }, 1250 );
            setTimeout( () => {
                this.updating = false;
                this.valide = false;
                this.modificationEnCours = false;
            }, 2500 );
        }
    }

    checkProprietesMagiquesIntegrity() {
        for (let i = 0 ; i < this.objet.effetMagique.length ; i++) {
            for (let indexDescription = 0 ;
                 indexDescription < this.objet.effetMagique[i].effetMagiqueDescription.length ; indexDescription++) {
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

            for (let indexInfos = 0 ;
                 indexInfos < this.objet.effetMagique[i].effetMagiqueDBInfos.length ; indexInfos++) {
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
    updateObjet() {
        this.setEmptyToNull();
        if (this.isEmptyObjet()) {
            // TODO : Supprimer objet
            this.objetService.objet(this.http, HttpMethods.DELETE, 0, this.objet)
                .then(
                    (data: any) => {
                        console.log(data);
                    }
                );
        } else {
            for (let indexEffet = 0; indexEffet < this.objet.effetMagique.length; indexEffet++) {
                if (this.isEmptyEffetMagique(this.objet.effetMagique[indexEffet])) {
                    // TODO : Supprimer effet
                    this.objetService.effetMagique(this.http, HttpMethods.DELETE, 0, this.objet.effetMagique[indexEffet])
                        .then(
                            (data: any) => {
                                console.log(data);
                            }
                        );
                } else {
                    for (let indexTable = 0; indexTable < this.objet.effetMagique[indexEffet].effetMagiqueTable.length; indexTable++) {
                        if (this.isEmptyTable(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable])) {
                            // TODO : Supprimer table
                            this.objetService.table(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable])
                                .then(
                                    (data: any) => {
                                        console.log(data);
                                    }
                                );
                        } else {
                            if (this.areDifferentTables(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable])) {
                                // TODO : Modifier la table.
                                this.objetService.table(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable])
                                    .then(
                                        (data: any) => {
                                            console.log(data);
                                        }
                                    );
                            }
                            for (let indexTitle = 0;
                                 indexTitle < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                     .effetMagiqueTableTitle.length;
                                 indexTitle++) {
                                if (this.isEmptyTableTitle(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                    .effetMagiqueTableTitle[indexTitle])) {
                                    // TODO : Supprimer title
                                    this.objetService.title(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle])
                                        .then(
                                            (data: any) => {
                                                console.log(data);
                                            }
                                        );
                                } else {
                                    if (this.areDifferentTableTitles(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle],
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle])) {
                                        // TODO : Modifier title
                                        this.objetService.title(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTitle[indexTitle])
                                            .then(
                                                (data: any) => {
                                                    console.log(data);
                                                }
                                            );
                                    }
                                    for (let indexTitleContent = 0;
                                         indexTitleContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                             .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent.length;
                                         indexTitleContent++) {
                                        if (this.isEmptyTableTitleContent(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent[indexTitleContent])) {
                                            // TODO : Supprimer title content
                                            this.objetService.titleContent(this.http, HttpMethods.DELETE, 0,
                                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTitle[indexTitle]
                                                    .effetMagiqueTableTitleContent[indexTitleContent]).then(
                                                (data: any) => {
                                                    console.log(data);
                                                }
                                            );
                                        } else {
                                            if (this.areDifferentTableTitleContents(this.objet.effetMagique[indexEffet]
                                                    .effetMagiqueTable[indexTable].effetMagiqueTableTitle[indexTitle]
                                                    .effetMagiqueTableTitleContent[indexTitleContent],
                                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTitle[indexTitle]
                                                    .effetMagiqueTableTitleContent[indexTitleContent])) {
                                                // TODO : Modifier title content
                                                this.objetService.titleContent(this.http, HttpMethods.PUT, 0,
                                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                        .effetMagiqueTableTitle[indexTitle]
                                                        .effetMagiqueTableTitleContent[indexTitleContent]).then(
                                                    (data: any) => {
                                                        console.log(data);
                                                    }
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                            for (let indexTr = 0;
                                 indexTr < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr.length;
                                 indexTr++) {
                                if (this.isEmptyTableTr(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                    .effetMagiqueTableTr[indexTr])) {
                                    // TODO : Supprimer tr
                                    this.objetService.tr(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr])
                                        .then(
                                            (data: any) => {
                                                console.log(data);
                                            }
                                        );
                                } else {
                                    if (this.areDifferentTableTrs(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr],
                                        this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr])) {
                                        // TODO : Modifier tr
                                        this.objetService.tr(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr])
                                            .then(
                                                (data: any) => {
                                                    console.log(data);
                                                }
                                            );
                                    }
                                    for (let indexTrContent = 0;
                                         indexTrContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                             .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent.length;
                                         indexTrContent++) {
                                        if (this.isEmptyTableTrContent(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                            .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent])) {
                                            // TODO : Supprimer tr content
                                            this.objetService.trContent(this.http, HttpMethods.DELETE, 0,
                                                this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]).then(
                                                (data: any) => {
                                                    console.log(data);
                                                }
                                            );
                                        } else {
                                            if (this.areDifferentTableTrContents(this.objet.effetMagique[indexEffet]
                                                    .effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr]
                                                    .effetMagiqueTableTrContent[indexTrContent],
                                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                    .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent])) {
                                                // TODO : Modifier tr content
                                                this.objetService.trContent(this.http, HttpMethods.PUT, 0,
                                                    this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                        .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]).then(
                                                    (data: any) => {
                                                        console.log(data);
                                                    }
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for (let indexUl = 0; indexUl < this.objet.effetMagique[indexEffet].effetMagiqueUl.length; indexUl++) {
                        if (this.isEmptyUl(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl])) {
                            // TODO : Supprimer ul
                            this.objetService.ul(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]).then(
                                (data: any) => {
                                    console.log(data);
                                }
                            );
                        } else {
                            if (this.areDifferentUls(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl])) {
                                // TODO : Modifier ul
                                this.objetService.ul(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]).then(
                                    (data: any) => {
                                        console.log(data);
                                    }
                                );
                            }
                            for (let indexUlContent = 0;
                                 indexUlContent < this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl].effetMagiqueUlContent.length;
                                 indexUlContent++) {
                                if (this.isEmptyUlContent(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                    .effetMagiqueUlContent[indexUlContent])) {
                                    // TODO : Supprimer ul content
                                    this.objetService.ulContent(this.http, HttpMethods.DELETE, 0,
                                        this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                            .effetMagiqueUlContent[indexUlContent]).then(
                                        (data: any) => {
                                            console.log(data);
                                        }
                                    );
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
                                        this.objetService.ulContent(this.http, HttpMethods.PUT, 0,
                                            this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                                .effetMagiqueUlContent[indexUlContent]).then(
                                            (data: any) => {
                                                console.log(data);
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }


                    for (let indexDescription = 0; indexDescription < this.objet.effetMagique[indexEffet].effetMagiqueDescription.length;
                         indexDescription++) {
                        if (this.isEmptyDescription(this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])) {
                            // TODO : Supprimer description
                            this.objetService.description(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])
                                .then(
                                    (data: any) => {
                                        console.log(data);
                                    }
                                );
                        } else {
                            if (this.areDifferentDescriptions(this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])) {
                                // TODO : Modifier description
                                this.objetService.description(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])
                                    .then(
                                        (data: any) => {
                                            console.log(data);
                                        }
                                    );
                            }
                        }
                    }


                    for (let indexInfos = 0; indexInfos < this.objet.effetMagique[indexEffet].effetMagiqueDBInfos.length;
                         indexInfos++) {
                        if (this.isEmptyInfo(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])) {
                            // TODO : Supprimer infos
                            this.objetService.infos(this.http, HttpMethods.DELETE, 0,
                                this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])
                                .then(
                                    (data: any) => {
                                        console.log(data);
                                    }
                                );
                        } else {
                            if (this.areDifferentInfos(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos],
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])) {
                                // TODO : Modifier infos
                                this.objetService.infos(this.http, HttpMethods.PUT, 0,
                                    this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])
                                    .then(
                                        (data: any) => {
                                            console.log(data);
                                        }
                                    );
                            }
                        }
                    }

                    if (this.areDifferentEffetsMagiques(this.objet.effetMagique[indexEffet], this.objetOriginal.effetMagique[indexEffet])) {
                        // TODO : Modifier effet
                        this.objetService.effetMagique(this.http, HttpMethods.PUT, 0, this.objet.effetMagique[indexEffet])
                            .then(
                                (data: any) => {
                                    console.log(data);
                                }
                            );
                    }
                }
            }
            if (this.areDifferentObjets(this.objet, this.objetOriginal)) {
                this.objetService.objet(this.http, HttpMethods.PUT, 0, this.objet).then(
                    (data: any) => {
                        console.log(data);
                    }
                );
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
        if (!this.isEmptyDescriptions(effetMagique.effetMagiqueDescription)) {
            return false;
        }

        return true;
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
        objetTemp1.effetMagique = null;
        objetTemp1.materiau = null;
        objetTemp1.malediction = null;
        const objetTemp2 = JSON.parse(JSON.stringify(objet2)) as ObjetCommunFromDB;
        objetTemp2.effetMagique = null;
        objetTemp2.materiau = null;
        objetTemp2.malediction = null;

        // console.log(objetTemp1);
        // console.log(objetTemp2);
        // console.log(JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2));
        // console.log(!equal(objetTemp1, objetTemp2)); // true
        // return JSON.stringify(objetTemp1) !== JSON.stringify(objetTemp2);
        return !equal(objetTemp1, objetTemp2);
    }
}
