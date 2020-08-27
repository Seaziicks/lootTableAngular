/* =====================================================*
||              Partie autocomplete                    ||
*===================================================== */

declare interface MonstreGroupe {
  Famille: string;
  Membres: Monstre[];
}

declare interface Monstre {
  idMonstre: number;
  idFamilleMonstre: number;
  libelle: string;
}

declare interface Famille {
  idFamilleMonstre: number;
  libelle: string;
}

declare interface MonstreLootChance {
  idLoot: number;
  libelle: string;
  minRoll: number;
  maxRoll: number;
  niveauMonstre: number;
  multiplier: number;
  dicePower: number;
  poids: number;
}

declare interface MonstreLootChanceBis {
  roll: number;
  idLoot: number;
  niveauMonstre: number;
  multiplier: number;
  diceNumber: number;
  dicePower: number;
  poids: number;
}

declare interface Loot {
  idLoot: number;
  libelle: string;
}




/* ====================================================*
||                 Partie JSon                        ||
*===================================================== */

/*
    Partie propriété magique
*/
export interface SortedMagicalProperty {
    weakAndSmall: MagicalProperty[];
    moderate: MagicalProperty[];
    strongAnfPowerful: MagicalProperty[];
    unknown: MagicalProperty[];
}


export interface MagicalProperty {
    title: string;
    description: string[];
    infos: Informations;
    table: TableMagicalProperty[];
    ul: UlMagicalProperty[];
}

export interface TableMagicalProperty {
    position: number;
    title: string[][];
    tr: string[][];
}

export interface TR {
    td: string[];
}

export interface UlMagicalProperty {
    position: number;
    li: string[];
}

export interface Informations {
    data: string[];
}

/*
    Partie table de drop
*/
export interface TablesChances {
    titles: string[];
    Chances: Chances[];
}

export interface Chances {
    lootChanceMin: number;
    lootChanceMax: number;
    name: string;
    price: number;
    currencyType: string;
}

/*
  ==================
  || Partie Objet ||
  ==================
*/

/*
    Partie commune
*/
export interface Objet {
    nom: string;
    prix: string;
    poids: string;
    source: string;
    objetsMagiques: ObjetMagique[];
    autresMateriaux: Materiau[];
}

export interface Arme extends Objet {
    degatsPetit: string;
    degatsMoyen: string;
    critique: string;
    facteurPortee: string;
    type: string;
    degatsParTaille: DegatsParTaille[];
}

export interface Armure extends Objet{
    bonArm: string;
    bonDext: string;
    malArm: string;
    RisqEch: string;
    vitess1: string;
    vitess2: string;
    prixParTaille: PrixParTaille[];
}
export interface Materiau {
    nom: string;
    prix: string;
    solidite: string;
    pointsDeResistance: string;
    effet: string;
    source: string;
}

export interface ObjetMagique {
    nom: string;
    prix: string;
    source: string;
}


/*
    Partie Arme
 */
export interface DegatsParTaille {
    taille: string;
    prix: string;
    degats: string;
    poids: string;
    resistance: string;
}

export interface CategorieArmes {
    title: string;
    armes: Arme[];
}

export interface CategoriesArmes {
    titles: string[];
    Categories: CategorieArmes[];
}

/*
    Partie Armure
 */
export interface PrixParTaille {
    taille: string;
    prixHumanoide: string;
    prixNonHumanoide: string;
    poids: string;
    resistance: string;
}

export interface CategorieArmures {
    title: string;
    armures: Armure[];
}

export interface CategoriesArmures {
    titles: string[];
    Categories: CategorieArmures[];
}
