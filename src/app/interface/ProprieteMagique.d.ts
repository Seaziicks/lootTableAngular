/* ====================================================*
||                 Partie JSon                        ||
*===================================================== */

/*
    Partie propriété magique
*/
declare interface SortedMagicalProperty {
    weakAndSmall: MagicalProperty[];
    moderate: MagicalProperty[];
    strongAnfPowerful: MagicalProperty[];
    unknown: MagicalProperty[];
}


declare interface MagicalProperty {
    title: string;
    description: string[];
    infos: Informations;
    table: TableMagicalProperty[];
    ul: UlMagicalProperty[];
}

declare interface TableMagicalProperty {
    position: number;
    title: string[][];
    tr: string[][];
}

declare interface UlMagicalProperty {
    position: number;
    li: string[];
}

declare interface Informations {
    data: string[];
}

/*
    Partie table de drop
*/
declare interface TablesChances {
    titles: string[];
    Chances: Chances[];
}

declare interface Chances {
    lootChanceMin: number;
    lootChanceMax: number;
    name: string;
    price: number;
    currencyType: string;
}
