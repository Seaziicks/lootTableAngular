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
        const d = document.getElementById('proprieteObjet');
        const save = d.getElementsByTagName('div')[0].innerHTML;
        const width = d.getElementsByTagName('div')[0].offsetWidth;
        const height = d.getElementsByTagName('div')[0].offsetHeight;
        console.log(width);
        console.log(height);
        console.log(save);

        const area = document.createElement('textarea');
        area.innerHTML = save;
        area.style.width = '' + width + 'px';
        area.style.height = '' + height + 'px';
        area.id = 'proprieteObjetArea';


        const valider = document.createElement('button');
        valider.innerText = 'Valider';
        valider.addEventListener('click',
            e => {
                const areaValidated = document.getElementById('proprieteObjetArea');
                const contentValidated = d.getElementsByTagName('textarea')[0].innerHTML;
                const div = document.createElement('div');
                div.innerHTML = contentValidated;
                div.style.width = '' + width;
                div.style.height = '' + height + 'px';
                d.removeChild(d.getElementsByTagName('textarea')[0]);
                d.removeChild(d.getElementsByTagName('button')[0]);
                d.removeChild(d.getElementsByTagName('button')[0]);

                const buttonModifier = document.createElement('button');
                buttonModifier.addEventListener('click', (e1) => {
                    this.modifierContenu();
                }, false);
                buttonModifier.innerText = 'Modifier';

                d.appendChild(div);
                d.appendChild(buttonModifier);
            });


        const reset = document.createElement('button');
        reset.innerText = 'Reset';
        reset.addEventListener('click',
            e => {
                const div = document.createElement('div');
                div.innerHTML = save;
                div.style.width = '' + width;
                div.style.height = '' + height + 'px';
                d.removeChild(d.getElementsByTagName('textarea')[0]);
                d.removeChild(d.getElementsByTagName('button')[0]);
                d.removeChild(d.getElementsByTagName('button')[0]);

                const buttonModifier = document.createElement('button');
                buttonModifier.addEventListener('click', (e2) => {
                    this.modifierContenu();
                }, false);
                buttonModifier.innerText = 'Modifier';

                d.appendChild(div);
                d.appendChild(buttonModifier);
            });


        d.removeChild(d.getElementsByTagName('div')[0]);
        d.removeChild(d.getElementsByTagName('button')[0]);
        d.appendChild(area);
        d.appendChild(valider);
        d.appendChild(reset);
    }

}
