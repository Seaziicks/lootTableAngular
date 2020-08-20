import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface TestObject {
  title: string;
  description: string[];
  infos: Informations;
  table: string[];
  ul: string[];
}

export interface Informations {
  data: string[];
}

@Component({
  selector: 'app-test-load-json',
  templateUrl: './test-load-json.component.html',
  styleUrls: ['./test-load-json.component.scss']
})
export class TestLoadJSonComponent implements OnInit {

  currentTestObject: TestObject;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getJSON().then(
      (data: any) => {
        const response: TestObject[] = JSON.parse(data) as TestObject[];
        console.log(response[45]);
        this.currentTestObject = response[45];
      }
    );
  }

  public getJSON(): Promise<string> {
    const baseUrlBis = 'assets/json/anneauxMagiques.json';
    return this.http.request('GET', baseUrlBis, {responseType: 'text'}).toPromise();

  }
}
