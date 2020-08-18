import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleAndMonstreService} from '../services/famille-and-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';

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
  monstreSelectionneLootChance: MonstreLootChanceBis[];
  lootSelectionne: MonstreLootChanceBis;
  lootPossible: Loot[] = [];
  input1: number = null;
  deDeDrop: number;
  malediction: number;
  effetMagique: number;
  effetMagique2: number;


  ngOnInit(): void {
    this.chargerFamilles(this.http);
    this.monstreLootChance.getLootPossibles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.lootPossible  = response.data as Loot[];
      }
    );
  }

  constructor( private http: HttpClient,
               private familleMonstre: FamilleAndMonstreService,
               private monstreLootChance: MonstreLootChanceService ) { }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(http);
  }

  public chargerMonstreLootChance() {
    this.monstreSelectionneLootChance = [];
    this.monstreLootChance.getMonstreLootChanceBis(this.http, this.monstreCourrant.idMonstre).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.monstreSelectionneLootChance  = response.data as MonstreLootChanceBis[];
      });
  }

  selectionMonstre($event: Monstre) {
    this.monstreCourrant = $event;
    this.monstreSelectionneLootChance = [];
    this.chargerMonstreLootChance();
  }

  selectionLoot(event: any) {
    if (+event.target.value > 20) {
      event.target.value = 20;
    }
    this.deDeDrop  = +event.target.value;
    this.lootSelectionne = this.monstreSelectionneLootChance.filter(lc => +lc.roll === this.deDeDrop)[0];
  }

  public isObjet(): boolean {
    return this.lootSelectionne && (this.lootSelectionne.idLoot ===  6 || this.isObjetMaudit());
  }

  public isObjetMaudit(): boolean {
    return this.lootSelectionne && (this.lootSelectionne.idLoot ===  1);
  }

  public isDoubleObjet() {
    return this.input1 >= 80 && this.input1 <= 90;
  }

  public isRecompenseValide(): boolean {
    if (!(this.deDeDrop && this.lootSelectionne)) {
      return false;
    }
    switch (this.lootSelectionne.idLoot) {
      case 2:
      case 3:
      case 4:
      case 5:
        return this.input1 != null;
      case 1:
        return this.input1 != null && this.effetMagique != null;
      case 6:
        return this.malediction != null && this.input1 != null && this.effetMagique != null;
    }
  }

  public getRecompense() {
    switch (this.lootSelectionne.idLoot) {
      case 2:
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces de cuivre.';
      case 3:
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'argent.';
      case 4:
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'or.';
      case 5:
        return 'Vous avez gagné ' + this.getRecompenseValue() + ' pièces d\'or.';
      case 1:
        break;
      case 6:
        break;
    }
  }

  public getRecompenseValue() {
    switch (this.lootSelectionne.idLoot) {
      case 2:
      case 3:
      case 4:
      case 5:
        return this.input1 * this.lootSelectionne.multiplier;
      case 1:
        break;
      case 6:
        break;
    }
  }

  lootSelectionneNom(): string {
    return this.lootPossible.filter(lp => lp.idLoot === this.lootSelectionne.idLoot)[0].libelle;
  }
}
