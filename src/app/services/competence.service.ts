import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BASE_URL, URL_FAMILLE_MONSTRE} from './rest.service';
import validate = WebAssembly.validate;

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

    updateCompetence(http: HttpClient, competence: Competence) {
        const values = { idCompetence: undefined, Competence: undefined };
        values.idCompetence = competence.idCompetence;
        values.Competence = competence;
        const baseUrlBis = BASE_URL + 'competenceRest.php' + '?idCompetence=' + competence.idCompetence;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Competence', JSON.stringify(values));

        return http.request('PUT', baseUrlBis, {responseType: 'text', params}).toPromise();
    }

    updateCompetenceContenu(http: HttpClient, competenceContenu: CompetenceContenu) {
        const values = { idCompetenceContenu: undefined, CompetenceContenu: undefined };
        values.idCompetenceContenu = competenceContenu.idCompetenceContenu;
        values.CompetenceContenu = competenceContenu;
        // values.CompetenceContenu.contenu = values.CompetenceContenu.contenu.replace('+', '\u002B');
        console.log(values.CompetenceContenu.contenu);
        const baseUrlBis = BASE_URL + 'competenceRest.php' + '?idCompetenceContenu=' + competenceContenu.idCompetenceContenu;
        console.log(baseUrlBis);
        const params = new HttpParams().set('CompetenceContenu', JSON.stringify(values));

        console.log(params);

        return http.request('PUT', baseUrlBis, {responseType: 'text', params}).toPromise();
    }
}
