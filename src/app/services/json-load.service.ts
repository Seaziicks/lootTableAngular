import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class JSonLoadService {

    constructor(private http: HttpClient) {
    }

    public async getJSON(folder: string, fileToLoad: string): Promise<Object> {
        const baseUrlBis = fileToLoad.endsWith('.json') ?
            'assets/json/' + folder + '/' + fileToLoad : 'assets/json/' + folder + '/' + fileToLoad + '.json';
        return await this.http.request('GET', baseUrlBis, {responseType: 'json'}).toPromise();
    }
}
