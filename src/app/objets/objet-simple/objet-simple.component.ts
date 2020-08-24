import {Component, OnInit} from '@angular/core';
import {MagicalProperty, SortedMagicalProperty, TablesChances} from '../../interface/MonstreGroupe';
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

    maudit = true;
    malediction: MagicalProperty;
    deMalediction: number;
    conditionsExterieur: MagicalProperty;
    conditions: TablesChances;
    deCondition: number;
    condition: string;
    inconveniants: TablesChances;
    inconveniant: string;
    deInconveniant: number;

    allObjetsMaudits: SortedMagicalProperty;
    deMauditSpecial: number;
    dePuissanceMalediction: number;

    constructor(private  http: HttpClient, private jsonService: JSonLoadService) {
        this.parametres = ['Ceci est un sceptre', 'Dé septentrional', 'Sceptre', 'magique', 'sceptres'];
        this.parametres = ['Ceci est un bâton', 'Dé bâton', 'Bâton', 'magique', 'batons'];
        this.parametres = ['Ceci sera un anneau', 'Dead Anno', 'Anneau', 'magique', 'anneauxMagiques'];
        this.parametres = ['Ceci est un objet merveilleux', 'Dé merveilleux', 'Objet merveileux', 'magique', 'objetsMerveilleux'];
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
        if (this.maudit) {
            this.jsonService.getJSON('magique', 'inconvenientsMalediction').then(
                (data: any) => {
                    console.log(data);
                    this.inconveniants = JSON.parse(data) as TablesChances;
                    console.log(this.inconveniants);
                }
            );
            this.jsonService.getJSON('magique', 'conditionsMalediction').then(
                (data: any) => {
                    console.log(data);
                    this.conditions = JSON.parse(data) as TablesChances;
                    console.log(this.conditions);
                }
            );
            this.jsonService.getJSON('magique', 'conditionExterieurMaledition').then(
                (data: any) => {
                    console.log(data);
                    this.conditionsExterieur = JSON.parse(data) as MagicalProperty;
                    console.log(this.conditionsExterieur);
                }
            );
            this.jsonService.getJSON('magique', 'objetsMauditsSpeciaux').then(
                (mauditsSpeciaux: any) => {
                    console.log(mauditsSpeciaux);
                    this.allObjetsMaudits = JSON.parse(mauditsSpeciaux) as SortedMagicalProperty;
                    console.log(JSON.parse(mauditsSpeciaux).strongAnfPowerful[9]);
                    console.log(this.allObjetsMaudits.strongAnfPowerful[9]);
                }
            );
        }
    }

    getFromChance(maledictions: TablesChances, dice: number) {
        const malediction = maledictions.Chances.filter(chance => (chance.lootChanceMin <= dice && chance.lootChanceMax >= dice))[0];
        return malediction.name;
    }

    getProprieteMagique() {
        this.proprietesObjet = [];
        if (this.deProprieteObjet && this.deProprieteObjet <= this.getNbProprietesMagiques()) {
            this.modificationEnCours = false;
            this.proprietesObjet
                .push(JSON.parse(JSON.stringify(this.getPropretesMagiques()[this.deProprieteObjet - 1])) as MagicalProperty);
            this.nom = this.proprietesObjet[0].title;
        }
    }

    getNbProprietesMagiques(): number {
        return this.getPropretesMagiques().length;
    }

    getNbObjetsMaudits(): number {
        return this.getObjetsMaudits().length;
    }

    getPropretesMagiques() {
        return this.dePuissance === 1 ? this.allObjets.weakAndSmall.concat(this.allObjets.unknown)
            : this.dePuissance === 2 ? this.allObjets.moderate.concat(this.allObjets.unknown)
                : this.allObjets.strongAnfPowerful.concat(this.allObjets.unknown);
    }

    getObjetsMaudits() {
        return this.dePuissanceMalediction === 1 ? this.allObjetsMaudits.weakAndSmall.concat(this.allObjetsMaudits.unknown)
            : this.dePuissanceMalediction === 2 ? this.allObjetsMaudits.moderate.concat(this.allObjetsMaudits.unknown)
                : this.allObjetsMaudits.strongAnfPowerful.concat(this.allObjetsMaudits.unknown);
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

    resetContenu() {
        this.getProprieteMagique();
    }

    printTest(object: any) {
        console.log(JSON.stringify(object));
        console.log(object);
    }

    trackByFn(index, item) {
        return index;
    }

    getMalediction(): MagicalProperty {
        let magicalProperty: MagicalProperty;
        if (this.dePuissance <= 11) { // Imaginaire
            magicalProperty = {
                description: ['Le possesseur pense que l’objet est ce qu’il semble être, alors qu’il n’a d’autre pouvoir que d’abuser son utilisateur. Ce dernier est persuadé que l’objet fonctionne normalement et seul le sort délivrance des malédictions peut le convaincre du contraire.'],
                infos: null,
                table: null,
                title: 'Effet imaginaire.',
                ul: null,
            } as MagicalProperty;
        } else if (this.dePuissance > 13 && this.dePuissance <= 23) { // Inversé
            magicalProperty = {
                description: ['Soit les objets maudits de ce genre ont un effet inverse de celui qui était prévu, soit ils affectent leur possesseur au lieu de ses adversaires. Certains de ces objets peuvent toutefois présenter un intérêt indéniable, même si leur fonction est totalement différente de ce qu’elle devrait être.\n' +
                'Parmi les objets maudits à effet opposé, on trouve les armes qui s’accompagnent d’un malus aux jets d’attaque et de dégâts. De même que les personnages ne connaissent pas immédiatement la valeur exacte du bonus d’altération conféré par leurs armes utiles, il n’y a aucune raison qu’ils se rendent compte immédiatement que leur nouvelle arme est maudite. Une fois qu’ils le comprennent, ils peuvent s’en séparer librement, à moins que l’arme ne s’accompagne d’un enchantement incitant son possesseur à vouloir la garder et à l’utiliser. Dans ce cas, le sort délivrance des malédictions est nécessaire pour s’en débarrasser.'],
                infos: null,
                table: null,
                title: 'Effet (ou cible) inversé.',
                ul: null,
            } as MagicalProperty;
        } else if (this.dePuissance > 26 && this.dePuissance <= 34) { // Fiabilité douteuse
            magicalProperty = {
                description: ['Chaque fois que l’objet est activé, il y a 5% de chances (01–05 sur 1d100) qu’il ne fonctionne pas. Ce risque de dysfonctionnement peut varier entre 1% et 10%, selon la campagne et le type d’objet.'],
                infos: null,
                table: null,
                title: 'Fiabilité douteuse.',
                ul: null,
            } as MagicalProperty;
        } else if (this.dePuissance > 39 && this.dePuissance <= 46) { // Condition extèrieure
            magicalProperty = {
                description: [''],
                infos: null,
                table: null,
                title: 'Dépendant d’une condition extérieure',
                ul: null,
            } as MagicalProperty;
            if (this.deMalediction) {
                this.condition = this.getFromChance(this.conditions, this.deMalediction);
            }
            magicalProperty.description[0] = this.condition;
        } else if (this.dePuissance > 52 && this.dePuissance <= 57) { // Incontrolable
            magicalProperty = {
                description: ['Un objet incontrôlable se met à fonctionner n’importe quand, sans que son propriétaire le décide. ' +
                'Jetez 1d100 chaque jour. ' +
                'Sur un résultat de 01–05, l’objet se met en marche au cours de la journée (l’instant exact étant déterminé aléatoirement). ' +
                'L’effet peut parfois être amusant, comme lorsqu’un personnage portant un anneau d’invisibilité disparaît en pleine séance de marchandage acharné, mais il peut également être désastreux, comme quand la baguette de boule de feu de l’aventurier s’actionne alors qu’il discute avec ses amis (lesquels ne le demeureront probablement pas après une telle mésaventure).'],
                infos: null,
                table: null,
                title: 'Incontrôlable.',
                ul: null,
            } as MagicalProperty;
        } else if (this.dePuissance > 65 && this.dePuissance <= 69) { // Conditions de fonctionnement
            magicalProperty = this.conditionsExterieur;
        } else if (this.dePuissance > 78 && this.dePuissance <= 80) { // Inconveniant
            magicalProperty = {
                description: [''],
                infos: null,
                table: null,
                title: 'Inconvéniant',
                ul: null,
            } as MagicalProperty;
            if (this.deMalediction) {
                this.inconveniant = this.getFromChance(this.inconveniants, this.deMalediction);
            }
            magicalProperty.description[0] = this.inconveniant;
        } else if (this.dePuissance > 80 && this.dePuissance <= 92) { // Effet inventé
                magicalProperty = {
                    description: ['Choisissez un effet préjudiciable, en vous inspirant éventuellement des objets maudits spéciaux, détaillés ci-dessous. ' +
                    'L’objet peut commencer à fonctionner normalement, mais à un moment, ses propriétés changent radicalement.'],
                    infos: null,
                    table: null,
                    title: 'Effet radicalement différent.',
                    ul: null,
                } as MagicalProperty;
        } else if (this.dePuissance > 92) { // Objet maudit spécial
            if (this.deMauditSpecial) {
                magicalProperty = JSON.parse(JSON.stringify(this.getObjetsMaudits()[this.deMauditSpecial - 1])) as MagicalProperty;
            }
        }
        return magicalProperty;
    }
}
