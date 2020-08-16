import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleMonstreService} from '../services/famille-monstre.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SpecialResponse} from '../loot-table/loot-table.component';


const filter = (opt: Monstre[], value: string): Monstre[] => {
  const filterValue = value.toLowerCase().trim();

  return opt.filter(item => item.libelle.toLowerCase().trim() === filterValue);
};

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
  familleMonstreSelectionne: Famille;

  constructor(private http: HttpClient,
              private familleMonstre: FamilleMonstreService,
  ) {
  }

  ngOnInit(): void {
    // this.familles = this.familleMonstre.chargerAllFamilles(this.http);
    this.familleMonstre.getAllFamilles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.familles = response.data as Famille[];
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
      // On met à jour le monstre courant, et on change la selection en JS vanilla. A voir si on peut faire autrement.
      this.monstreCourrant = $event;
      (document.getElementById('monstreLibelle') as HTMLInputElement).value = this.monstreCourrant.libelle;
      // Selection de la famille et affichage, car je n'arrive pas à le faire sans JS Vanilla.
      this.familleMonstreSelectionne = this.familles.filter(f => f.idFamilleMonstre == $event.idFamilleMonstre)[0];
      const familleToSelect: number =
        this.familleMonstreSelectionne !== undefined ? this.familleMonstreSelectionne.idFamilleMonstre : 0;
      (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[familleToSelect].selected = true;
    }
  }

  selectionFamille(event) {
    this.familleCourante = this.familles.filter(option => option.libelle.toLowerCase().indexOf(event.option.value.toLowerCase()) === 0)[0];
  }

  private _filterGroup(value: string): MonstreGroupe[] {
    if (value) {
      return this.monstresGroupes
        .map(group => ({Famille: group.Famille, Membres: filter(group.Membres, value)}))
        .filter(group => group.Membres.length > 0);
    }
    return this.monstresGroupes;
  }

  public updateMonstreCourant() {
    if (!this.monstreCourrant) {
      const value: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
      let famille = this.monstresGroupes
        .map(f => {
          for (const membre of f.Membres) {
            console.log(membre.libelle.toLowerCase() + '===' + value.toLowerCase() + ' : '
              + (membre.libelle.toLowerCase() === value.toLowerCase()));
            if (membre.libelle.toLocaleLowerCase() === value.toLowerCase()) {
              return membre;
            }
          }
          return undefined;
        });
      famille = famille.filter(element => element !== undefined);
      console.log(famille);
      console.log(famille[0]);
      this.selectionMonstre(famille[0]);
      return value === famille[0].libelle;
    }
  }

  alreadyExist(): boolean {
    if (this.monstreCourrant) {
      const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
      const idFamille = select.options[select.selectedIndex].value;

      const value: string = this.monstreCourrant.libelle;
      let famille = this.monstresGroupes
        .map(f => {
          for (const membre of f.Membres) {
            console.log(membre.libelle.toLowerCase() + '===' + value.toLowerCase() + ' : '
              + (membre.libelle.toLowerCase() === value.toLowerCase()));
            if (membre.libelle.toLowerCase() === value.toLowerCase()) {
              return membre;
            }
          }
          return undefined;
        });
      famille = famille.filter(element => element !== undefined);
      console.log(famille.filter(element => element !== undefined));
      console.log(famille[0]);
      console.log(famille[0] !== undefined && famille[0].idFamilleMonstre === +idFamille);
      return famille[0] !== undefined && famille[0].idFamilleMonstre === +idFamille;
    }
    return false;
  }

  modifierMonstre() {
    const libelle: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
    console.log('Modification monstre');
    console.log(this.familleMonstreSelectionne);

    const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
    const idFamille = select.options[select.selectedIndex].value;
    console.log(idFamille);
    this.familleMonstre.modifierMonstre(this.http, this.monstreCourrant.idMonstre,
      +idFamille, libelle).then(
      (data: any) => {
        console.log(data);
      }
    );
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(this.http);
  }

  creerMonstre() {
    const libelle: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
    console.log('Ajout monstre');
    this.familleMonstre.creerMonstre(this.http, this.familleMonstreSelectionne.idFamilleMonstre, libelle).then(
      (data: any) => {
        console.log(data);
      }
    );
    this.monstresGroupes = this.familleMonstre.chargerFamillesAvecMonstres(this.http);
  }

  updateFamille() {
    const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
    const idFamille = select.options[select.selectedIndex].value;
    this.familleMonstreSelectionne = this.familles.filter(f => f.idFamilleMonstre === +idFamille)[0];
  }

}
