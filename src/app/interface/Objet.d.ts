/*
  ==================
  || Partie Objet ||
  ==================
*/
declare interface ObjetCommunDB {
    idObjet: number;
    idPersonnage: number;
    nom: string;
    fauxNom: string;
    bonus: number;
    type: string;
    prix: number;
    prixNonHumanoide: number;
    devise: string;
    proprieteMagique: MagicalProperty[];
    malediction: Malediction;
    categorie: string;
    materiau: Materiau;
    taille: string;
    degats: string;
    critique: string;
    facteurPortee: string;
    armure: number;
    bonusDexteriteMax: number;
    malusArmureTests: number;
    risqueEchecSorts: string;
}

/*
    Partie commune
*/
declare interface Objet {
    idObjet: number;
    nom: string;
    fauxNom: string;
    prix: string;
    poids: string;
    source: string;
    objetsMagiques: ObjetMagique[];
    autresMateriaux: Materiau[];
}

declare interface Arme extends Objet {
    degatsPetit: string;
    degatsMoyen: string;
    critique: string;
    facteurPortee: string;
    type: string;
    degatsParTaille: DegatsParTaille[];
}

declare interface Armure extends Objet {
    bonArm: string;
    bonDext: string;
    malArm: string;
    RisqEch: string;
    vitess1: string;
    vitess2: string;
    prixParTaille: PrixParTaille[];
}

declare interface Materiau {
    idMateriaux: number;
    nom: string;
    prix: string;
    solidite: string;
    pointsDeResistance: string;
    effet: string;
    source: string;
}

declare interface ObjetMagique {
    nom: string;
    prix: string;
    source: string;
}


/*
    Partie Arme
 */
declare interface DegatsParTaille {
    taille: string;
    prix: string;
    degats: string;
    poids: string;
    resistance: string;
}

declare interface CategorieArmes {
    title: string;
    armes: Arme[];
}

declare interface CategoriesArmes {
    titles: string[];
    Categories: CategorieArmes[];
}

/*
    Partie Armure
 */
declare interface PrixParTaille {
    taille: string;
    prixHumanoide: string;
    prixNonHumanoide: string;
    poids: string;
    resistance: string;
}

declare interface CategorieArmures {
    title: string;
    armures: Armure[];
}

declare interface CategoriesArmures {
    titles: string[];
    Categories: CategorieArmures[];
}

declare interface Malediction {
    idMalediction: number;
    nom: string;
    description: string;
}

