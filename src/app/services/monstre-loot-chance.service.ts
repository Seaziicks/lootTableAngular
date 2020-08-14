import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {SpecialResponse} from '../loot-table/loot-table.component';
// @ts-ignore
import {MonstreLootChance} from '../interface/MonstreGroupe';

@Injectable({
  providedIn: 'root'
})
export class MonstreLootChanceService {

  constructor() {
  }
  public addedRow: boolean[] = [];

  public chargerMonstreLootChance(http: HttpClient, idMonstre: number, lootPossible?: string[]): MonstreLootChance[] {
    const monstreSelectionneLootChance: MonstreLootChance[] = [];
    const baseUrlBis = BASE_URL + 'lootChanceRest.php?idMonstre=' + idMonstre;
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        // monstreSelectionneLootChance = [];
        const lootChances: MonstreLootChance[] = response.data as MonstreLootChance[];
        for (const lootChance of lootChances) {
          monstreSelectionneLootChance.push(lootChance);
        }
        if (lootPossible && monstreSelectionneLootChance.length < 5) {
          this.addedRow = this.remplissageLootManquant(monstreSelectionneLootChance, lootPossible);
        }
        console.log(this.addedRow);
        console.log(monstreSelectionneLootChance);
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
        console.log('Je suis complete !');
      }
    );
    console.log(JSON.stringify(monstreSelectionneLootChance));
    return monstreSelectionneLootChance;
  }

  public remplissageLootManquant(monstreSelectionneLootChance: MonstreLootChance[], lootPossible: string[]): boolean[] {
    const addedRow: boolean[] = [];
    for (const value of lootPossible) {
      addedRow.push(false);
    }
    for (let i = 0; i < lootPossible.length; i++) {
      if (!monstreSelectionneLootChance.map(a => a.libelle).includes(lootPossible[i])) {
        monstreSelectionneLootChance.splice(i, 0,
          {
            libelle: lootPossible[i], minRoll: null, maxRoll: null, niveauMonstre: null, multiplier: null, dicePower: null,
            poids: null
          } as unknown as MonstreLootChance);
        addedRow[i] = true;
      }
    }
    return addedRow;
  }

  public getLootPossibles(http: HttpClient): string[] {
    const monstreSelectionneLootPossibles: string[] = [];
    const baseUrlBis = BASE_URL + 'lootPossiblesRest.php';
    const applicationTypeObservable: Observable<SpecialResponse> =
      http.get<SpecialResponse>(baseUrlBis);
    const applicationTypeSubscription: Subscription = applicationTypeObservable.subscribe(
      (response) => {
        const lootPossibles: string[] = response.data as string[];
        for (const lootPossible of lootPossibles) {
          monstreSelectionneLootPossibles.push(lootPossible);
        }
        applicationTypeSubscription.unsubscribe();
      },
      (error) => {
        console.log('Une erreur est survenue dans la suscription: ' + error);
      },
      () => {
      }
    );
    return monstreSelectionneLootPossibles;
  }
}
