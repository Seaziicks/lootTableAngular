import {Component, OnInit, ViewChild} from '@angular/core';
import {MagicalProperty, SortedMagicalProperty, TablesChances} from '../../interface/MonstreGroupe';
import {JSonLoadService} from '../../services/json-load.service';
import {MaledictionsComponent} from '../maledictions/maledictions.component';

@Component({
    selector: 'app-objet-simple',
    templateUrl: './objet-simple.component.html',
    styleUrls: ['./objet-simple.component.scss']
})
export class ObjetSimpleComponent implements OnInit {

    @ViewChild('maledictionsComponent') maledictionComponent: MaledictionsComponent;

    nom: string;
    bonus: number;
    type: string;
    proprietesObjet: MagicalProperty[] = [];
    prix: number;
    currencyType: string;

    dePuissance: number;
    deProprieteObjet: number;

    allObjets: SortedMagicalProperty;

    parametres: string[];

    modificationEnCoursPM = false;

    maudit = true;
    malediction: MagicalProperty;

    constructor(private jsonService: JSonLoadService) {
        this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        this.parametres = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
        this.parametres = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
        this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
    }

    ngOnInit(): void {
        this.jsonService.getJSON(this.parametres[3], this.parametres[4]).then(
            (effetsObjet: any) => {
                // console.log(effetsObjet);
                this.allObjets = JSON.parse(effetsObjet) as SortedMagicalProperty;
                // console.log(JSON.parse(effetsObjet).strongAnfPowerful[9]);
                // console.log(this.allObjets.strongAnfPowerful[9]);
            }
        );
    }

    loadComplete(): boolean {
        if (this.maudit) {
            return this.allObjets && this.maledictionComponent.loadComplete();
        } else {
            return !!this.allObjets;
        }
    }

    getProprieteMagique() {
        this.proprietesObjet = [];
        if (this.dePuissance && this.deProprieteObjet && this.deProprieteObjet <= this.getNbProprietesMagiques()) {
            this.modificationEnCoursPM = false;
            this.proprietesObjet
                .push(JSON.parse(JSON.stringify(this.getPropretesMagiques()[this.deProprieteObjet - 1])) as MagicalProperty);
            this.nom = this.proprietesObjet[0].title;
            this.getPrixAndCurrency(this.proprietesObjet[0].infos.data);
            // console.log(this.prix);
            // console.log(this.currencyType);
        }
    }

    getPrixAndCurrency(data: string[]) {
        const indexPrix = data.indexOf(data.filter(f => f === 'Prix')[0]) + 1;
        const match = data[indexPrix].match(/([0-9]+ )+/)[0];
        this.prix = +match.replace(' ', '');
        this.currencyType = data[indexPrix].replace(match, '')
            .replace(' ', '').replace('.', '');
    }

    getNbProprietesMagiques(): number {
        return this.getPropretesMagiques().length;
    }

    getPropretesMagiques() {
        return this.dePuissance === 1 ? this.allObjets.weakAndSmall.concat(this.allObjets.unknown)
            : this.dePuissance === 2 ? this.allObjets.moderate.concat(this.allObjets.unknown)
                : this.dePuissance === 3 ? this.allObjets.strongAnfPowerful.concat(this.allObjets.unknown) :
                    null;
    }

    reset() {
        this.proprietesObjet = [];
        // this.type = undefined;
        this.nom = undefined;
        this.prix = 0;
    }

    getNomsProprieteMagique(): string {
        return this.proprietesObjet ? '' :
            this.proprietesObjet.length < 2 ? this.proprietesObjet[0].title :
                this.proprietesObjet[0].title + ' et ' + this.proprietesObjet[1].title;
    }

    modifierContenu() {
        this.modificationEnCoursPM = !this.modificationEnCoursPM;
    }

    resetContenu() {
        this.getProprieteMagique();
        this.modificationEnCoursPM = false;
    }

    printTest(object: any) {
        console.log(JSON.stringify(object));
        console.log(object);
    }

    trackByFn(index, item) {
        return index;
    }

    selectionMalediction($event: MagicalProperty) {
        this.malediction = $event;
        console.log(this.malediction);
    }
}
