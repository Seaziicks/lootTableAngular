declare interface Personnage {
    idPersonnage: number;
    nom: string;
    niveau: number;
    niveauEnAttente: number;
    intelligence: number;
    force: number;
    agilite: number;
    sagesse: number;
    constitution: number;
    vitalite: number;
    mana: number;
    deVitaliteNaturelle: number;
    deManaNaturel: number;
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
    constitution: number;
    vitalite: number;
    vitaliteNaturelle: number;
    deVitalite: number;
    mana: number;
    manaNaturel: number;
    deMana: number;
}

declare interface ProgressionPersonnage {
    idProgressionPersonnage: number;
    niveau: number;
    statistiques: boolean;
    nombreStatistiques: number;
    pointCompetence: boolean;
    nombrePointsCompetences: number;
}



declare class Competence {
    idCompetence: number;
    idPersonnage: number;
    idCompetenceParent: number;
    titre: string;
    niveau: number;
    icone: string;
    contenu: CompetenceContenu[];
    etat: string;
    optionnelle: boolean;
    children: Competence[];
}

declare class CompetenceContenu {
    idCompetenceContenu: number;
    idCompetence: number;
    niveauCompetenceRequis: number;
    contenu: string;
}
