import { Component, OnInit } from '@angular/core';
import {MagicalProperty} from "../../interface/MonstreGroupe";
import {HttpClient} from "@angular/common/http";
import {JSonLoadService} from "../../services/json-load.service";

@Component({
  selector: 'app-objets-merveilleux',
  templateUrl: './objets-merveilleux.component.html',
  styleUrls: ['./objets-merveilleux.component.scss']
})
export class ObjetsMerveilleuxComponent implements OnInit {

    nom: string;
    proprietesMagiques: MagicalProperty[] = [];
    prix: number;

    deProprieteMagique: number;

    isMagique = true;

    allProprietesMagiques: MagicalProperty[] = [];

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'objetsMerveilleux').then(
            (effetsArmuresMagiques: any) => {
                this.allProprietesMagiques = JSON.parse(effetsArmuresMagiques) as MagicalProperty[];
            }
        );
    }

    getProprieteMagique() {
        this.proprietesMagiques = [];
        this.proprietesMagiques.push(this.allProprietesMagiques[this.deProprieteMagique - 1]);
    }

    getNbProprietesMagiques(): number {
        return this.allProprietesMagiques.length;
    }

    reset() {
        this.proprietesMagiques = [];
        // this.type = undefined;
        this.nom = undefined;
        this.prix = 0;
    }

    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
            this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }

}
