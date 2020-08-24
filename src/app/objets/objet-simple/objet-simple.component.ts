import {Component, OnInit} from '@angular/core';
import {MagicalProperty, SortedMagicalProperty} from '../../interface/MonstreGroupe';
import {HttpClient} from '@angular/common/http';
import {JSonLoadService} from '../../services/json-load.service';

@Component({
    selector: 'app-objet-simple',
    templateUrl: './objet-simple.component.html',
    styleUrls: ['./objet-simple.component.scss']
})
export class ObjetSimpleComponent implements OnInit {

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

    modificationEnCours = false;

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
        this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        this.parametres = ['Ceci est un bâton', 'Dé bâton', 'Bâton', 'magique', 'batons'];
        this.parametres = ['Ceci est un objet merveilleux', 'Dé merveilleux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
        this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
    }

    ngOnInit(): void {
        this.jsonService.getJSON(this.parametres[3], this.parametres[4]).then(
            (effetsObjet: any) => {
                console.log(effetsObjet);
                this.allObjets = JSON.parse(effetsObjet) as SortedMagicalProperty;
                console.log(JSON.parse(effetsObjet).strongAnfPowerful[9]);
                console.log(this.allObjets.strongAnfPowerful[9]);
            }
        );
    }

    getProprieteMagique() {
        this.proprietesObjet = [];
        if (this.deProprieteObjet && this.deProprieteObjet <= this.getNbProprietesMagiques()) {
            this.proprietesObjet.push(this.getPropretesMagiques()[this.deProprieteObjet - 1]);
        }
    }

    getNbProprietesMagiques(): number {
        return this.getPropretesMagiques().length;
    }

    getPropretesMagiques() {
        return this.dePuissance === 1 ? this.allObjets.weakAndSmall.concat(this.allObjets.unknown)
            : this.dePuissance === 2 ? this.allObjets.moderate.concat(this.allObjets.unknown)
            : this.allObjets.strongAnfPowerful.concat(this.allObjets.unknown);
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
        this.modificationEnCours = !this.modificationEnCours;
    }

    printTest(object: any) {
        console.log(JSON.stringify(object));
        console.log(object);
    }

}
