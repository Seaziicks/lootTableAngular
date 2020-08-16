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
