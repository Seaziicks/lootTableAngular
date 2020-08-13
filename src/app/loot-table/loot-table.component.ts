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

  monstresGroupes: MonstreGroupe[];
  monstreCourrant: Monstre;
  monstreSelectionneLootChance: MonstreLootChance[];
  lootSelectionne: MonstreLootChance;
  Cuivre: number;
  Argent: number;
  Or: number;
  ObjetMagique: number;
  ObjetMaudit: number;
  deDeDrop: number;

  ngOnInit(): void {
    this.chargerFamilles(this.http);
  }

  constructor( private http: HttpClient ) { }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = [];
    const baseUrlBis = BASE_URL + 'monstresRest.php?withFamille=true';
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        const familles: MonstreGroupe[] = response.data as MonstreGroupe[];
        for (const famille of familles) {
          this.monstresGroupes.push(famille);
        }
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
      }
    );
  }

  public chargerMonstreLootChance(http: HttpClient, idMonstre: number) {
    this.monstreSelectionneLootChance = [];
    const baseUrlBis = BASE_URL + 'lootChanceRest.php?idMonstre=' + idMonstre;
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        const lootChances: MonstreLootChance[] = response.data as MonstreLootChance[];
        for (const lootChance of lootChances) {
          this.monstreSelectionneLootChance.push(lootChance);
        }
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
      }
    );
  }

  selectionMonstre($event: Monstre) {
    this.monstreCourrant = $event;
    this.chargerMonstreLootChance(this.http, $event.idMonstre);
  }

  selectionLoot(event: any) {
    const dice = event.target.value;
    this.lootSelectionne = this.monstreSelectionneLootChance
      .filter(item => (item.minRoll <= dice && item.maxRoll >= dice))[0];
  }

  public getMinRoll(libelle: string): number {
    return this.monstreSelectionneLootChance.filter(item => item.libelle.toLowerCase().indexOf(libelle.toLowerCase()) === 0)[0].minRoll;
  }
  public getMaxRoll(libelle: string): number {
    return this.monstreSelectionneLootChance.filter(item => item.libelle.toLowerCase().indexOf(libelle.toLowerCase()) === 0)[0].maxRoll;
  }

  public getDicePower(libelle: string): number {
    return this.monstreSelectionneLootChance.filter(item => item.libelle.toLowerCase().indexOf(libelle.toLowerCase()) === 0)[0].dicePower;
  }
}
