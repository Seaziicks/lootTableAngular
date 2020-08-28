import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MagicalProperty, SortedMagicalProperty, TablesChances} from '../../interface/MonstreGroupe';
import {JSonLoadService} from '../../services/json-load.service';
import {MaledictionsComponent} from '../maledictions/maledictions.component';
import {ObjetCommun} from '../objet-commun';

@Component({
    selector: 'app-objet-simple',
    templateUrl: './objet-simple.component.html',
    styleUrls: ['./objet-simple.component.scss']
})
export class ObjetSimpleComponent extends ObjetCommun implements OnInit {

    @Output() objetSimpleEventEmitter = new EventEmitter<ObjetSimpleComponent>();
    @ViewChild('maledictionsComponent') maledictionComponent: MaledictionsComponent;
    @Input() maudit: boolean = true;

    parametres: string[];

    constructor(private jsonService: JSonLoadService) {
        super(jsonService);
        this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        this.parametres = ['Ceci est un bâton', 'Débat thon', 'Bâton', 'magique', 'batons'];
        this.parametres = ['Ceci est un objet merveilleux', 'Demer veille eux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
        this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
        this.type = this.parametres[2];
    }

    ngOnInit(): void {
        this.jsonService.getJSON(this.parametres[3], this.parametres[4]).then(
            (effetsObjet: any) => {
                // console.log(effetsObjet);
                this.allProprietesMagiques = JSON.parse(effetsObjet) as SortedMagicalProperty;
                // console.log(JSON.parse(effetsObjet).strongAnfPowerful[9]);
                // console.log(this.allObjets.strongAnfPowerful[9]);
            }
        );
    }

    loadComplete(): boolean {
        if (this.maudit) {
            return this.allProprietesMagiques && this.maledictionComponent.loadComplete();
        } else {
            return !!this.allProprietesMagiques;
        }
    }

    reset() {
        this.proprietesMagiques = [];
        this.nom = undefined;
        this.prix = 0;
    }

    getNomsProprieteMagique(): string {
        return this.proprietesMagiques.length < 1 ? '' :
            this.proprietesMagiques.length < 2 ? this.proprietesMagiques[0].title :
                this.proprietesMagiques[0].title + ' et ' + this.proprietesMagiques[1].title;
    }

    setNom() {
        if (this.proprietesMagiques.length > 0) {
            this.nom = this.proprietesMagiques[0].title;
        }
        // console.log(this.nom);
    }

    setBonus(data: string[]) {
        this.bonus = null;
    }

    selection() {
        this.valide = true;
        this.objetSimpleEventEmitter.emit(this);
    }

    deselection() {
        this.valide = false;
        this.objetSimpleEventEmitter.emit(null);
    }
}
