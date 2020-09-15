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
