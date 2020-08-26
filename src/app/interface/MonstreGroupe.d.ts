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




/* ---------------------------------------------------*
|                  Partie JSon                        |
*-----------------------------------------------------*/

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

export interface Arme {
    nom: string;
    prix: string;
    degatsPetit: string;
    degatsMoyen: string;
    critique: string;
    facteurPortee: string;
    poids: string;
    type: string;
    source: string;
    degatsParTaille: DegatsParTaille[];
    objetsMagiques: ObjetMagique[];
    autresMateriaux: Materiau[];
}

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

export interface Armure {
    nom: string;
    prix: string;
    bonArm: string;
    bonDext: string;
    malArm: string;
    RisqEch: string;
    vitess1: string;
    vitess2: string;
    poids: string;
    source: string;
    prixParTaille: PrixParTaille[];
    objetsMagiques: ObjetMagique[];
    autresMateriaux: Materiau[];
}

export interface PrixParTaille {
    taille: string;
    prixHumanoide: string;
    prixNonHumanoide: string;
    poids: string;
    resistance: string;
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

export interface CategorieArmures {
    title: string;
    armures: Armure[];
}

export interface CategoriesArmures {
    titles: string[];
    Categories: CategorieArmures[];
}
