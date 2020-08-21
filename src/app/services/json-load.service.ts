import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MagicalProperty} from '../test-load-json/test-load-json.component';

@Injectable({
    providedIn: 'root'
})
export class JSonLoadService {

    constructor(private http: HttpClient) {
    }

    public getJSON(folder: string, fileToLoad: string): Promise<string> {
        const baseUrlBis = fileToLoad.endsWith('.json') ?
            'assets/json/' + folder + '/' + fileToLoad : 'assets/json/' + folder + '/' + fileToLoad + '.json';
        return this.http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();
    }
}
