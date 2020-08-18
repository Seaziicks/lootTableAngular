import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleAndMonstreService} from '../services/famille-and-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {FadingInfoComponent} from "../fading-info/fading-info.component";

@Component({
  selector: 'app-gestion-drop-monstre-bis',
  templateUrl: './gestion-drop-monstre-bis.component.html',
  styleUrls: ['./gestion-drop-monstre-bis.component.scss']
})
export class GestionDropMonstreBisComponent implements OnInit {

  @ViewChild('Banner') banner: FadingInfoComponent;

  monstresGroupes: MonstreGroupe[];
  monstreCourrant: Monstre;
  monstreSelectionneLootChance: MonstreLootChanceBis[];
  monstreSelectionneLootChanceOriginal: MonstreLootChanceBis[];
  lootPossible: Loot[] = [];

  unUpdatableMonstreLootChance: MonstreLootChanceBis[] = [];
  monstreLootChanceToPOST: MonstreLootChanceBis[] = [];
  monstreLootChanceToPUT: MonstreLootChanceBis[] = [];
  unchangesLootChance: MonstreLootChanceBis[] = [];

  differ: any;

  constructor(private http: HttpClient,
              private familleMonstre: FamilleAndMonstreService,
              private monstreLootChance: MonstreLootChanceService,
  ) {
  }

  ngOnInit(): void {
    this.chargerFamilles(this.http);
    this.monstreLootChance.getLootPossibles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.lootPossible  = response.data as Loot[];
      }
    );
  }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(http);
    console.log(JSON.stringify(this.monstresGroupes));
  }

  public chargerMonstreLootChance() {
    this.monstreSelectionneLootChance = [];
    this.monstreSelectionneLootChanceOriginal = [];

    this.monstreLootChance.getMonstreLootChanceBis(this.http, this.monstreCourrant.idMonstre).then(
      (data: any) => {
        console.log(data);
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.monstreSelectionneLootChance = response.data as MonstreLootChanceBis[];
        this.remplissageLootManquant(this.monstreSelectionneLootChance , this.lootPossible);
        this.monstreSelectionneLootChanceOriginal = this.monstreSelectionneLootChance .map(x => Object.assign({}, x));
      });
  }

  public remplissageLootManquant(monstreSelectionneLootChance: MonstreLootChanceBis[], lootPossible: Loot[]) {
    for (let i = 0; i < 20; i++) {
      if (!monstreSelectionneLootChance.map(a => + a.roll).includes((i + 1))) {
        monstreSelectionneLootChance.splice(i, 0,
          {
            roll: (i + 1), idLoot: 0, niveauMonstre: null, multiplier: null, diceNumber: null, dicePower: null, poids: null
          } as unknown as MonstreLootChanceBis);

      }
    }
  }

  selectionMonstre($event: Monstre) {
    if (!this.monstreCourrant || this.monstreCourrant.idMonstre !== $event.idMonstre) {
      this.monstreCourrant = $event;
      this.chargerMonstreLootChance();
    }
  }

  public missingAtLeastOneValue(index: number) {
    for (const key in this.monstreSelectionneLootChance[index]) {
      if (this.monstreSelectionneLootChance[index][key] == null && key !== 'niveauMonstre' && key !== 'poids') {
        return true;
      }
    }
    return false;
  }

  public thereIsAtLeastOneValue(index: number) {
    for (const key in this.monstreSelectionneLootChance[index]) {
      if (this.monstreSelectionneLootChance[index][key] != null && key !== 'niveauMonstre' && key !== 'poids' && key !== 'idLoot') {
        return true;
      }
    }
    return false;
  }

  public originalLootChanceWasEmpty(index: number) {
    for (const key in this.monstreSelectionneLootChanceOriginal[index]) {
      if (this.monstreSelectionneLootChanceOriginal[index][key] != null && key !== 'niveauMonstre' && key !== 'poids'
        && key !== 'roll' && key !== 'libelle' && this.monstreSelectionneLootChanceOriginal[index].idLoot !== 0) {
        return false;
      }
    }
    console.log('originalLootChanceWasEmpty => true');
    return true;
  }

  public missingMyValue(index: number, key: string) {
    return this.monstreSelectionneLootChance[index][key] == null;
  }

  public lootChanceIsCorrect(index: number) {
    for (const key in this.monstreSelectionneLootChance[index]) {
      if (this.monstreSelectionneLootChance[index][key] == null && key !== 'niveauMonstre' && key !== 'poids') {
        console.log('La clef ' + key + 'est null');
        return false;
      }
    }
    return true;
  }

  public lootChanceIsDifferentFromOriginalOne(index: number) {
    return !(JSON.stringify(this.monstreSelectionneLootChanceOriginal[index]) === JSON.stringify(this.monstreSelectionneLootChance[index]));
  }

  public updateOrCreateLootChance() {
    this.monstreLootChanceToPOST = [];
    this.monstreLootChanceToPUT = [];
    this.unUpdatableMonstreLootChance = [];
    this.unchangesLootChance = [];
    for (let i = 0; i < 20; i++) {
      console.log(this.monstreSelectionneLootChance[i]);
      if (this.thereIsAtLeastOneValue(i) && this.missingAtLeastOneValue(i)) {
        // console.log('Ajout dans unUpdatable');
        this.unUpdatableMonstreLootChance.push(this.monstreSelectionneLootChance[i]);
      } else if (this.originalLootChanceWasEmpty(i) && this.lootChanceIsCorrect(i)) {
        console.log('Ajout dans POST');
        console.log(this.monstreSelectionneLootChance[i]);
        this.monstreLootChanceToPOST.push(this.monstreSelectionneLootChance[i]);
      } else if (this.lootChanceIsCorrect(i) && this.lootChanceIsDifferentFromOriginalOne(i)) {
        console.log('Ajout dans PUT');
        console.log(this.monstreSelectionneLootChance[i]);
        this.monstreLootChanceToPUT.push(this.monstreSelectionneLootChance[i]);
      } else {
        console.log('Ajout dans unChanged');
        this.unchangesLootChance.push(this.monstreSelectionneLootChance[i]);
      }
    }
    if (this.monstreLootChanceToPOST.length > 0) {
      this.monstreLootChance.envoyerLootChancesBis(this.http, 'POST', this.monstreCourrant.idMonstre, this.monstreLootChanceToPOST).then(
        (data: any) => {
          console.log(data);
          const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
          this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
          this.monstreLootChanceToPOST = [];
          this.monstreLootChanceToPUT = [];
          this.unUpdatableMonstreLootChance = [];
          this.unchangesLootChance = [];
          this.chargerMonstreLootChance();
        });
    }
    if (this.monstreLootChanceToPUT.length > 0) {
      this.monstreLootChance.envoyerLootChancesBis(this.http, 'PUT', this.monstreCourrant.idMonstre, this.monstreLootChanceToPUT).then(
        (data: any) => {
          console.log(data);
          const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
          this.banner.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
          this.monstreLootChanceToPOST = [];
          this.monstreLootChanceToPUT = [];
          this.unUpdatableMonstreLootChance = [];
          this.unchangesLootChance = [];
          this.chargerMonstreLootChance();
        });
    }
  }

  public uncompleteForm(): boolean {
    if (this.monstreSelectionneLootChance) {
      for (let i = 0; i < this.monstreSelectionneLootChance.length; i++) {
        if (this.missingAtLeastOneValue(i)) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

}
