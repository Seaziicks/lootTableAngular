import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {JSonLoadService} from '../../services/json-load.service';

@Component({
    selector: 'app-maledictions',
    templateUrl: './maledictions.component.html',
    styleUrls: ['./maledictions.component.scss']
})
export class MaledictionsComponent implements OnInit {

    @Output() maledictionEventEmitter = new EventEmitter<MagicalProperty>();

    modificationEnCoursMalediction = false;
    validee = false;

    malediction: MagicalProperty;
    deMalediction: number;
    deMalediction2: number;
    // ---------------------------------------
    conditionsExterieur: MagicalProperty;
    // ---------------------------------------
    conditionsDeFonctionnement: TablesChances;
    conditionDeFonctionnement: string;
    // ----------------------------------------
    inconveniants: TablesChances;
    inconveniant: string;
    // ----------------------------------------
    allObjetsMaudits: SortedMagicalProperty;
    dePuissanceMalediction: number;

    constructor(private jsonService: JSonLoadService) {
    }

    ngOnInit(): void {
        this.jsonService.getJSON('magique', 'inconvenientsMalediction').then(
            (data: any) => {
                // console.log(data);
                this.inconveniants = JSON.parse(data) as TablesChances;
                // console.log(this.inconveniants);
            }
        );
        this.jsonService.getJSON('magique', 'conditionsMalediction').then(
            (data: any) => {
                // console.log(data);
                this.conditionsDeFonctionnement = JSON.parse(data) as TablesChances;
                // console.log(this.conditions);
            }
        );
        this.jsonService.getJSON('magique', 'conditionExterieurMaledition').then(
            (data: any) => {
                // console.log(data);
                this.conditionsExterieur = JSON.parse(data) as MagicalProperty;
                // console.log(this.conditionsExterieur);
            }
        );
        this.jsonService.getJSON('magique', 'objetsMauditsSpeciaux').then(
            (mauditsSpeciaux: any) => {
                // console.log(mauditsSpeciaux);
                this.allObjetsMaudits = JSON.parse(mauditsSpeciaux) as SortedMagicalProperty;
                // console.log(JSON.parse(mauditsSpeciaux).strongAnfPowerful[9]);
                // console.log(this.allObjetsMaudits.strongAnfPowerful[9]);
            }
        );
    }

    loadComplete(): boolean {
        return !!(this.inconveniants && this.conditionsDeFonctionnement && this.conditionsExterieur && this.allObjetsMaudits);
    }

    getFromChance(maledictions: TablesChances, dice: number) {
        const malediction = (JSON.parse(JSON.stringify(
            maledictions.Chances.filter(chance => (chance.lootChanceMin <= dice && chance.lootChanceMax >= dice))[0])) as Chances);
        return malediction.name;
    }

    getNbObjetsMaudits(): number {
        return this.getObjetsMaudits().length;
    }

    getObjetsMaudits() {
        return this.dePuissanceMalediction === 1 ? this.allObjetsMaudits.weakAndSmall.concat(this.allObjetsMaudits.unknown)
            : this.dePuissanceMalediction === 2 ? this.allObjetsMaudits.moderate.concat(this.allObjetsMaudits.unknown)
                : this.dePuissanceMalediction === 3 ? this.allObjetsMaudits.strongAnfPowerful.concat(this.allObjetsMaudits.unknown)
                    : null;
    }

    modifierMalediction() {
        this.modificationEnCoursMalediction = !this.modificationEnCoursMalediction;
    }

    resetContenuMalediction() {
        this.getMalediction();
        this.modificationEnCoursMalediction = false;
    }

    trackByFn(index, item) {
        return index;
    }

    resetMalediction() {
        this.deMalediction2 = null;
        this.malediction = null;
    }

    getMalediction(): MagicalProperty {
        this.malediction = null;
        let magicalProperty: MagicalProperty;
        if (this.deMalediction && this.deMalediction <= 11) { // Imaginaire
            magicalProperty = {
                description: ['Le possesseur pense que l’objet est ce qu’il semble être, alors qu’il n’a d’autre pouvoir que d’abuser son utilisateur. Ce dernier est persuadé que l’objet fonctionne normalement et seul le sort délivrance des malédictions peut le convaincre du contraire.'],
                infos: null,
                table: null,
                title: 'Effet imaginaire.',
                ul: null,
            } as MagicalProperty;
        } else if (this.deMalediction > 11 && this.deMalediction <= 23) { // Inversé
            magicalProperty = {
                description: ['Soit les objets maudits de ce genre ont un effet inverse de celui qui était prévu, soit ils affectent leur possesseur au lieu de ses adversaires. Certains de ces objets peuvent toutefois présenter un intérêt indéniable, même si leur fonction est totalement différente de ce qu’elle devrait être.\n' +
                'Parmi les objets maudits à effet opposé, on trouve les armes qui s’accompagnent d’un malus aux jets d’attaque et de dégâts. De même que les personnages ne connaissent pas immédiatement la valeur exacte du bonus d’altération conféré par leurs armes utiles, il n’y a aucune raison qu’ils se rendent compte immédiatement que leur nouvelle arme est maudite. Une fois qu’ils le comprennent, ils peuvent s’en séparer librement, à moins que l’arme ne s’accompagne d’un enchantement incitant son possesseur à vouloir la garder et à l’utiliser. Dans ce cas, le sort délivrance des malédictions est nécessaire pour s’en débarrasser.'],
                infos: null,
                table: null,
                title: 'Effet (ou cible) inversé.',
                ul: null,
            } as MagicalProperty;
        } else if (this.deMalediction > 23 && this.deMalediction <= 34) { // Fiabilité douteuse
            magicalProperty = {
                description: ['Chaque fois que l’objet est activé, il y a 5% de chances (01–05 sur 1d100) qu’il ne fonctionne pas. Ce risque de dysfonctionnement peut varier entre 1% et 10%, selon la campagne et le type d’objet.'],
                infos: null,
                table: null,
                title: 'Fiabilité douteuse.',
                ul: null,
            } as MagicalProperty;
        } else if (this.deMalediction > 34 && this.deMalediction <= 46) { // Condition extèrieure
            magicalProperty = {
                description: [''],
                infos: null,
                table: null,
                title: 'Dépendant d’une condition extérieure',
                ul: null,
            } as MagicalProperty;
            if (this.deMalediction2) {
                this.conditionDeFonctionnement = this.getFromChance(this.conditionsDeFonctionnement, this.deMalediction2);
            }
            magicalProperty.description[0] = this.conditionDeFonctionnement;
        } else if (this.deMalediction > 46 && this.deMalediction <= 57) { // Incontrolable
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
        } else if (this.deMalediction > 57 && this.deMalediction <= 69) { // Conditions de fonctionnement
            magicalProperty = (JSON.parse(JSON.stringify(this.conditionsExterieur)) as MagicalProperty);
        } else if (this.deMalediction > 69 && this.deMalediction <= 80) { // Inconveniant
            magicalProperty = {
                description: [''],
                infos: null,
                table: null,
                title: 'Inconvéniant',
                ul: null,
            } as MagicalProperty;
            if (this.deMalediction2) {
                this.inconveniant = this.getFromChance(this.inconveniants, this.deMalediction2);
            }
            magicalProperty.description[0] = this.inconveniant;
        } else if (this.deMalediction > 80 && this.deMalediction <= 92) { // Effet inventé
            magicalProperty = {
                description: ['Choisissez un effet préjudiciable, en vous inspirant éventuellement des objets maudits spéciaux, détaillés ci-dessous. ' +
                'L’objet peut commencer à fonctionner normalement, mais à un moment, ses propriétés changent radicalement.'],
                infos: null,
                table: null,
                title: 'Effet radicalement différent.',
                ul: null,
            } as MagicalProperty;
        } else if (this.deMalediction > 92) { // Objet maudit spécial
            if (this.deMalediction2 && this.dePuissanceMalediction) {
                magicalProperty = JSON.parse(JSON.stringify(this.getObjetsMaudits()[this.deMalediction2 - 1])) as MagicalProperty;
            }
        }
        this.malediction = magicalProperty;
        return magicalProperty;
    }

    isInconveniant(): boolean {
        return this.deMalediction > 69 && this.deMalediction <= 80;
    }

    isConditionDeFonctionnement(): boolean {
        return this.deMalediction > 57 && this.deMalediction <= 69;
    }

    isConditionExterieure(): boolean {
        return this.deMalediction > 34 && this.deMalediction <= 46;
    }

    isObjetMauditSpecial(): boolean {
        return this.deMalediction > 92;
    }

    selection() {
        this.validee = true;
        this.maledictionEventEmitter.emit(this.malediction);
    }

    deselection() {
        this.validee = false;
        this.maledictionEventEmitter.emit(null);
    }

}
