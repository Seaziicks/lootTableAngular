import {Component, IterableDiffers, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleMonstreService} from '../services/famille-monstre.service';
import {MonstreLootChanceService} from '../services/monstre-loot-chance.service';


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
    this.lootPossible = this.monstreLootChance.getLootPossibles(this.http);
  }

  public chargerFamilles(http: HttpClient) {
    this.monstresGroupes = this.familleMonstre.chargerFamilles(http);
    console.log(JSON.stringify(this.monstresGroupes));
  }

  public chargerMonstreLootChance(http: HttpClient, idMonstre: number) {
    // this.monstreSelectionneLootChance = [];
    this.monstreSelectionneLootChance = this.monstreLootChance.chargerMonstreLootChance(http, idMonstre, this.lootPossible);
    this.monstreSelectionneLootChanceOriginal = this.monstreSelectionneLootChance.copyWithin(-1, -1);
    this.addedRow = this.monstreLootChance.addedRow;
    console.log(JSON.stringify(this.addedRow));
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

  public missingMyValue(index: number, key: string) {
    return this.monstreSelectionneLootChance[index][key] == null;

  }

  public updateOrCreateLootChance() {

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
