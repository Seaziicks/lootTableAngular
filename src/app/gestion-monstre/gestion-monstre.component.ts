import {Component, IterableDiffers, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleMonstreService} from '../services/famille-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';
import {SpecialResponse} from '../loot-table/loot-table.component';


export const filterMissing = (opt: MonstreLootChance[], values: any[]): string[] => {
  return values.map(a => a.libelle).filter(f => !opt.map(a => a.libelle).includes(f));
};

@Component({
  selector: 'app-gestion-monstre',
  templateUrl: './gestion-monstre.component.html',
  styleUrls: ['./gestion-monstre.component.scss']
})
export class GestionMonstreComponent implements OnInit {

  monstresGroupes: MonstreGroupe[];
  monstreCourrant: Monstre;
  monstreSelectionneLootChance: MonstreLootChance[];
  monstreSelectionneLootChanceOriginal: MonstreLootChance[];
  lootPossible: string[] = [];
  addedRow: boolean[] = [];

  unUpdatableMonstreLootChance: MonstreLootChance[] = [];
  monstreLootChanceToPOST: MonstreLootChance[] = [];
  monstreLootChanceToPUT: MonstreLootChance[] = [];
  unchangesLootChance: MonstreLootChance[] = [];

  differ: any;

  constructor(private http: HttpClient,
              private familleMonstre: FamilleMonstreService,
              private monstreLootChance: MonstreLootChanceService,
              differs: IterableDiffers,
  ) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit(): void {
    this.chargerFamilles(this.http);
    this.monstreLootChance.getLootPossibles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.lootPossible  = response.data as string[];
      }
    );
  }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = this.familleMonstre.chargerFamilles(http);
    console.log(JSON.stringify(this.monstresGroupes));
  }

  public chargerMonstreLootChance(http: HttpClient, idMonstre: number) {
    this.monstreSelectionneLootChance = [];
    this.addedRow = [];
    this.monstreLootChance.getMonstreLootChanceTest(this.http, this.monstreCourrant.idMonstre).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.monstreSelectionneLootChance  = response.data as MonstreLootChance[];
        this.addedRow = this.remplissageLootManquant(this.monstreSelectionneLootChance , this.lootPossible);
        this.monstreSelectionneLootChanceOriginal = this.monstreSelectionneLootChance .map(x => Object.assign({}, x));
      });
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
            idLoot: (i + 1), libelle: lootPossible[i], minRoll: null, maxRoll: null, niveauMonstre: null, multiplier: null,
            dicePower: null, poids: null
          } as unknown as MonstreLootChance);
        addedRow[i] = true;
      }
    }
    return addedRow;
  }

  selectionMonstre($event: Monstre) {
    if (!this.monstreCourrant || this.monstreCourrant.idMonstre !== $event.idMonstre) {
      this.monstreCourrant = $event;
      this.chargerMonstreLootChance(this.http, $event.idMonstre);
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
        && key !== 'idLoot' && key !== 'libelle') {
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
    for (let i = 0; i < this.lootPossible.length; i++) {
      console.log(this.monstreSelectionneLootChance[i]);
      if (this.thereIsAtLeastOneValue(i) && this.missingAtLeastOneValue(i)) {
        console.log('Ajout dans unUpdatable');
        this.unUpdatableMonstreLootChance.push(this.monstreSelectionneLootChance[i]);
      } else if (this.originalLootChanceWasEmpty(i) && this.lootChanceIsCorrect(i)) {
        console.log('Ajout dans POST');
        this.monstreLootChanceToPOST.push(this.monstreSelectionneLootChance[i]);
      } else if (this.lootChanceIsCorrect(i) && this.lootChanceIsDifferentFromOriginalOne(i)) {
        console.log('Ajout dans PUT');
        this.monstreLootChanceToPUT.push(this.monstreSelectionneLootChance[i]);
      } else {
        console.log('Ajout dans unChanged');
        this.unchangesLootChance.push(this.monstreSelectionneLootChance[i]);
      }
      console.log((this.unUpdatableMonstreLootChance.length + this.monstreLootChanceToPOST.length
        + this.monstreLootChanceToPUT.length + this.unchangesLootChance.length));
    }
    if (this.monstreLootChanceToPOST.length > 0) {
      this.monstreLootChance.envoyerLootChances(this.http, 'POST', this.monstreCourrant.idMonstre, this.monstreLootChanceToPOST).then(
        (data: any) => {
          console.log(data);
          this.monstreLootChanceToPOST = [];
          this.monstreLootChanceToPUT = [];
          this.unUpdatableMonstreLootChance = [];
          this.unchangesLootChance = [];
        });
    }
    if (this.monstreLootChanceToPUT.length > 0) {
      this.monstreLootChance.envoyerLootChances(this.http, 'PUT', this.monstreCourrant.idMonstre, this.monstreLootChanceToPUT).then(
        (data: any) => {
          console.log(data);
          this.monstreLootChanceToPOST = [];
          this.monstreLootChanceToPUT = [];
          this.unUpdatableMonstreLootChance = [];
          this.unchangesLootChance = [];
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
