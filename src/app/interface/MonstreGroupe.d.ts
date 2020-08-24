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



