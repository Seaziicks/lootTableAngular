declare interface Personnage {
    idPersonnage: number;
    nom: string;
    niveau: number;
    intelligence: number;
    force: number;
    agilite: number;
    sagesse: number;
    constitutuion: number;
    vitalite: number;
    mana: number;
    statistiquesParNiveau: StatistiquesParNiveau[];
}

declare interface PersonnageMinimisation {
    idPersonnage: number;
    niveau: number;
    nom: string;
}


declare interface StatistiquesParNiveau {
    niveau: number;
    intelligence: number;
    force: number;
    agilite: number;
    sagesse: number;
    constitutuion: number;
    vitalite: number;
    mana: number;
}
