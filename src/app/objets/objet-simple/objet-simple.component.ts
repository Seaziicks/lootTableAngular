import {Component, OnInit} from '@angular/core';
import {MagicalProperty} from '../../interface/MonstreGroupe';
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

    deProprieteObjet: number;

    allObjets: MagicalProperty[] = [];

    parametres: string[];

    modificationEnCours = false;

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
        this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
        this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        this.parametres = ['Ceci est un bâton', 'Dé bâton', 'Bâton', 'magique', 'batons'];
        this.parametres = ['Ceci est un objet merveilleux', 'Dé merveilleux', 'Objet merveileux', 'magique', 'objetsMerveilleuxDecode'];
    }

    ngOnInit(): void {
        this.jsonService.getJSON(this.parametres[3], this.parametres[4]).then(
            (effetsObjet: any) => {
                this.allObjets = JSON.parse(effetsObjet) as MagicalProperty[];
                console.log(this.allObjets[148]);
            }
        );
    }

    getProprieteMagique() {
        this.proprietesObjet = [];
        if (this.deProprieteObjet && this.deProprieteObjet <= this.allObjets.length) {
            this.proprietesObjet.push(this.allObjets[this.deProprieteObjet - 1]);
        }
    }

    getNbProprietesMagiques(): number {
        return this.allObjets.length;
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

}
