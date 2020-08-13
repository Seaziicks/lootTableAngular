import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../services/rest.service';
import {Observable, Subscription} from 'rxjs';

export interface SpecialResponse {
  status: number;
  status_message: string;
  data: any[];
}


@Component({
  selector: 'app-loot-table',
  templateUrl: './loot-table.component.html',
  styleUrls: ['./loot-table.component.scss']
})
export class LootTableComponent implements OnInit {

  idMonstre = -1;
  monstresGroupesBis: MonstreGroupe[];

  ngOnInit(): void {
    this.chargerMonstres(this.http);
  }

  constructor( private http: HttpClient ) { }

  public chargerMonstres(http: HttpClient) {
    this.monstresGroupesBis = [];
    const baseUrlBis = BASE_URL + 'monstresRest.php?withFamille=true';
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        const familles: MonstreGroupe[] = response.data as MonstreGroupe[];
        for (const famille of familles) {
          this.monstresGroupesBis.push(famille);
        }
        this.monstresGroupesBis = response.data;
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
      }
    );
  }
}
