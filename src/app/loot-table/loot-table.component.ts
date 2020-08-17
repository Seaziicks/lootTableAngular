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

  constructor( private http: HttpClient,
               private familleMonstre: FamilleAndMonstreService,
               private monstreLootChance: MonstreLootChanceService ) { }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(http);
  }

  public chargerMonstreLootChance(http: HttpClient, idMonstre: number) {
    this.monstreSelectionneLootChance = [];
    this.monstreLootChance.getMonstreLootChanceTest(this.http, this.monstreCourrant.idMonstre).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.monstreSelectionneLootChance  = response.data as MonstreLootChance[];
      });
  }

  selectionMonstre($event: Monstre) {
    this.monstreCourrant = $event;
    this.monstreSelectionneLootChance = [];
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
