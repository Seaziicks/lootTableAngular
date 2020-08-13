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
  input1: number = null;
  deDeDrop: number;
  malediction: number;
  effetMagique: number;
  effetMagique2: number;


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
    if (+event.target.value > 20) {
      event.target.value = 20;
    }
    this.deDeDrop  = +event.target.value;
    this.lootSelectionne = this.monstreSelectionneLootChance
      .filter(item => (item.minRoll <= this.deDeDrop  && item.maxRoll >= this.deDeDrop ))[0];
  }

  public isObjet(): boolean {
    return this.lootSelectionne && (this.lootSelectionne.libelle.toLowerCase() ===  'objet magique' || this.isObjetMaudit());
  }

  public isObjetMaudit(): boolean {
    return this.lootSelectionne && (this.lootSelectionne.libelle.toLocaleLowerCase() ===  'objet maudit');
  }

  public isDoubleObjet() {
    return this.input1 >= 80 && this.input1 <= 90;
  }

  public isRecompenseValide(): boolean {
    if (!(this.deDeDrop && this.lootSelectionne)) {
      return false;
    }
    switch (this.lootSelectionne.libelle.toLowerCase()) {
      case 'cuivre':
      case 'argent':
      case 'or':
        return this.input1 != null;
      case 'objet magique':
        return this.input1 != null && this.effetMagique != null;
      case 'objet maudit':
        return this.malediction != null && this.input1 != null && this.effetMagique != null;
    }
  }

  public getRecompense() {
    switch (this.lootSelectionne.libelle.toLowerCase()) {
      case 'cuivre':
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces de cuivre.';
      case 'argent':
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'argent.';
      case 'or':
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'or.';
      case 'objet magique':
        break;
      case 'objet maudit':
        break;
    }
  }

  public getRecompenseValue() {
    switch (this.lootSelectionne.libelle.toLowerCase()) {
      case 'cuivre':
      case 'argent':
      case 'or':
        return this.input1 * this.lootSelectionne.multiplier;
      case 'objet magique':
        break;
      case 'objet maudit':
        break;
    }
  }
}
