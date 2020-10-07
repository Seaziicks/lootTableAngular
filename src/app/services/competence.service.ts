import {Injectable} from '@angular/core';
import {SkillType} from 'beautiful-skill-tree';
import {Competence, CompetenceContenu} from '../gestionPersonnage/personnageCompetences/MyReactComponentWrapper';
import {ReactNode} from 'react';

@Injectable({
    providedIn: 'root'
})
export class CompetenceService {

    constructor() {
    }


    extractAllCompetences(competencesToExtract: Competence[]): Competence[] {
        const competences: Competence[] = [];
        for (const competence of competencesToExtract) {
            console.log(competence);
            Array.prototype.push.apply(competences, this.extractCompetence(competence));
        }
        console.log(competences);
        return competences;
    }

    extractCompetence(competence: Competence) {
        const competences: Competence[] = [];
        competences.push(competence);
        console.log(competence);
        for (const children of competence.children) {
            Array.prototype.push.apply(competences, this.extractCompetence(children));
        }
        return competences;
    }
}
