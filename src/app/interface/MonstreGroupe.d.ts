declare interface MonstreGroupe {
  Famille: string;
  Membres: Monstre[];
}

declare interface Monstre {
  idMonstre: number;
  libelle: string;
}

declare interface MonstreLootChance {
  libelle: string;
  minRoll: number;
  maxRoll: number;
  niveauMonstre: number;
  multiplier: number;
  dicePower: number;
  poids: number;
}
