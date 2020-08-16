import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleMonstreService} from '../services/famille-monstre.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
  selector: 'app-gestion-monstre',
  templateUrl: './gestion-monstre.component.html',
  styleUrls: ['./gestion-monstre.component.scss']
})
export class GestionMonstreComponent implements OnInit {


  myControl = new FormControl();
  familles: Famille[];
  familleCourante: Famille;
  filteredFamilles: Observable<Famille[]>;

  monstresGroupes: MonstreGroupe[];
  monstreCourrant: Monstre;

  constructor(private http: HttpClient,
              private familleMonstre: FamilleMonstreService,
  ) {
  }

  ngOnInit(): void {
    // this.familles = this.familleMonstre.chargerAllFamilles(this.http);
    this.familleMonstre.getAllFamilles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.familles  = response.data as Famille[];
        console.log(this.familles);
        this.filteredFamilles = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filter(value))
        );
      }
    );
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(this.http);
  }

  private filter(value: string): Famille[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.familles.filter(option => option.libelle.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.familles;
  }


  selectionMonstre($event: Monstre) {
    if (!this.monstreCourrant || this.monstreCourrant.idMonstre !== $event.idMonstre) {
      this.monstreCourrant = $event;
    }
  }

  selectionFamille(event) {
    this.familleCourante = this.familles.filter(option => option.libelle.toLowerCase().indexOf(event.option.value.toLowerCase()) === 0)[0];
  }
}
