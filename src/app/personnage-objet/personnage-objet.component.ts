import {Component, Input, OnInit} from '@angular/core';
import {ObjetService} from '../services/objet.service';
import {HttpClient} from '@angular/common/http';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
    selector: 'app-personnage-objet',
    templateUrl: './personnage-objet.component.html',
    styleUrls: ['./personnage-objet.component.scss']
})
export class PersonnageObjetComponent implements OnInit {

    @Input() id: number;

    objet: ObjetCommunFromDB;
    objetOriginal: ObjetCommunFromDB;

    modificationEnCours = false;
    valide = false;

    constructor(private http: HttpClient,
                private objetService: ObjetService) { }

    ngOnInit(): void {
        this.objetService.getObjetComplet(this.http, this.id).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as ObjetCommunFromDB;
                this.objetOriginal = JSON.parse(JSON.stringify(this.objet)) as ObjetCommunFromDB;
                console.log(this.objet);
            }
        );
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
            this.objetOriginal = JSON.parse(JSON.stringify(this.objet)) as ObjetCommunFromDB;
            this.updateObjet();
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

    // Ne gère que l'update. La suppression sera à gérer dans la fonction checkProprietesMagiquesIntegrity.
    // Ça sera plus simple.
    // Ou alors, il ne faut mettre à jour la supression que quand on valide l'objet.
    // Et ne plus utiliser checkProprietesMagiquesIntegrity, ce qui serait plus simple.
    // Sinon, on ne sait pas quelle ligne supprimer.
    updateObjet() {
        for (let indexEffet = 0 ; indexEffet < this.objet.effetMagique.length ; indexEffet++) {
            if (this.isEmptyEffetMagique(this.objet.effetMagique[indexEffet])) {
                // TODO : Supprimer effet
            } else {
                for (let indexTable = 0; indexTable < this.objet.effetMagique[indexEffet].effetMagiqueTable.length; indexTable++) {
                    if (this.isEmptyTable(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable])) {
                        // TODO : Supprimer table
                    } else {
                        if (this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                            !== this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]) {
                            // TODO : Modifier la table.
                        }
                        for (let indexTitle = 0;
                             indexTitle < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTitle.length;
                             indexTitle++) {
                            if (this.isEmptyTableTitle(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                .effetMagiqueTableTitle[indexTitle])) {
                                // TODO : Supprimer title
                            } else {
                                if (this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTitle[indexTitle] !==
                                    this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                        .effetMagiqueTableTitle[indexTitle]) {
                                    // TODO : Modifier title
                                }
                                for (let indexTitleContent = 0;
                                     indexTitleContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                         .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent.length;
                                     indexTitleContent++) {
                                    if (this.isEmptyTableTitleContent(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                        .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent[indexTitleContent])) {
                                        // TODO : Supprimer title content
                                    } else {
                                        if (this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent[indexTitleContent] !==
                                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTitle[indexTitle].effetMagiqueTableTitleContent[indexTitleContent]) {
                                            // TODO : Modifier title content
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
                            } else {
                                if (this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable].effetMagiqueTableTr[indexTr] !==
                                    this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                        .effetMagiqueTableTr[indexTr]) {
                                    // TODO : Modifier tr
                                }
                                for (let indexTrContent = 0;
                                     indexTrContent < this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                         .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent.length;
                                     indexTrContent++) {
                                    if (this.isEmptyTableTrContent(this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                        .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent])) {
                                        // TODO : Supprimer tr content
                                    } else {
                                        if (this.objet.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent] !==
                                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueTable[indexTable]
                                                .effetMagiqueTableTr[indexTr].effetMagiqueTableTrContent[indexTrContent]) {
                                            // TODO : Modifier tr content
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
                    } else {
                        if (this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl] !==
                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl]) {
                            // TODO : Modifier ul
                        }
                        for (let indexUlContent = 0;
                             indexUlContent < this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl].effetMagiqueUlContent.length;
                             indexUlContent++) {
                            if (this.isEmptyUlContent(this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                .effetMagiqueUlContent[indexUlContent])) {
                                // TODO : Supprimer ul contnet
                            } else {
                                if (this.objet.effetMagique[indexEffet].effetMagiqueUl[indexUl].effetMagiqueUlContent[indexUlContent]
                                    !== this.objetOriginal.effetMagique[indexEffet].effetMagiqueUl[indexUl]
                                        .effetMagiqueUlContent[indexUlContent]) {
                                    // TODO : Modifier ul content
                                }
                            }
                        }
                    }
                }

                if (this.isEmptyDescriptions(this.objet.effetMagique[indexEffet].effetMagiqueDescription)) {
                    // TODO : Supprimer descriptions
                } else {
                    for (let indexDescription = 0; indexDescription < this.objet.effetMagique[indexEffet].effetMagiqueDescription.length;
                         indexDescription++) {
                        if (this.isEmptyDescription(this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription])) {
                            // TODO : Supprimer desctiption
                        } else {
                            if (this.objet.effetMagique[indexEffet].effetMagiqueDescription[indexDescription].contenu !==
                                this.objetOriginal.effetMagique[indexEffet].effetMagiqueDescription[indexDescription].contenu) {
                                // TODO : Modifier description
                            }
                        }
                    }
                }

                if (this.isEmptyInfos(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos)) {
                    // TODO : Supprimer infos
                }
                for (let indexInfos = 0; indexInfos < this.objet.effetMagique[indexEffet].effetMagiqueDBInfos.length;
                     indexInfos++) {
                    if (this.isEmptyInfo(this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos])) {
                        // TODO : Supprimer info
                    } else {
                        if (this.objet.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos].contenu !==
                            this.objetOriginal.effetMagique[indexEffet].effetMagiqueDBInfos[indexInfos].contenu) {
                            // TODO : Modifier infos
                        }
                    }
                }

                if (this.objet.effetMagique[indexEffet].title !== this.objetOriginal.effetMagique[indexEffet].title) {
                    // TODO : Modifier effet
                }
            }
        }
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
        return !(!!effetMagiqueUlContent.contenu) || effetMagiqueUlContent.contenu.length === 0;
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
}
