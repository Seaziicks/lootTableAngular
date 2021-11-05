import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BACKEND_URL} from './rest.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Injectable({
    providedIn: 'root'
})
export class CompetenceService {

    constructor(private http: HttpClient) {
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

    async updateCompetence(competence: Competence): Promise<SpecialResponse> {
        const values = { idCompetence: undefined, Competence: undefined };
        values.idCompetence = competence.idCompetence;
        values.Competence = competence;
        const baseUrlBis = BACKEND_URL + 'competenceRest.php' + '?idCompetence=' + competence.idCompetence;
        console.log(baseUrlBis);
        const params = new HttpParams().set('Competence', JSON.stringify(values));
        console.log(values);

        return await this.http.request('PUT', baseUrlBis, {responseType: 'json', params}).toPromise() as SpecialResponse;
    }

    async updateCompetenceContenu(http: HttpClient, competenceContenu: CompetenceContenu): Promise<SpecialResponse> {
        const values = { idCompetenceContenu: undefined, CompetenceContenu: undefined };
        values.idCompetenceContenu = competenceContenu.idCompetenceContenu;
        values.CompetenceContenu = competenceContenu;
        // values.CompetenceContenu.contenu = values.CompetenceContenu.contenu.replace('+', '\u002B');
        console.log(values.CompetenceContenu.contenu);
        const baseUrlBis = BACKEND_URL + 'competenceRest.php' + '?idCompetenceContenu=' + competenceContenu.idCompetenceContenu;
        console.log(baseUrlBis);
        const params = new HttpParams().set('CompetenceContenu', JSON.stringify(values));

        console.log(params);

        return await http.request('PUT', baseUrlBis, {responseType: 'json', params}).toPromise() as SpecialResponse;
    }
}
