import {Component, ContentChild, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilleAndMonstreService} from '../services/famille-and-monstre.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {AutocompleteGroupeComponent} from '../autocomplete-groupe/autocomplete-groupe.component';

@Component({
  selector: 'app-gestion-monstre',
  templateUrl: './gestion-monstre.component.html',
  styleUrls: ['./gestion-monstre.component.scss']
})
export class GestionMonstreComponent implements OnInit {

  @ContentChild('monstreLibelle') child: HTMLInputElement;
  @ViewChild('autocompleteGroupeMonstre') autocompleteGroupeMonstre: AutocompleteGroupeComponent;


  myControl = new FormControl();
  familles: Famille[];
  familleCourante: Famille;
  filteredFamilles: Observable<Famille[]>;

  monstresGroupes: MonstreGroupe[];
  monstreCourrant: Monstre;
  familleMonstreSelectionne: Famille;

  monstreExactMatchV: boolean;

  constructor(private http: HttpClient,
              private familleAndMonstreService: FamilleAndMonstreService,
  ) {
  }

  ngOnInit(): void {
    // this.familles = this.familleAndMonstreService.chargerAllFamilles(this.http);
    this.chargerFamille();
    // this.monstresGroupes = this.familleAndMonstreService.chargerFamillesAvecMonstres(this.http);
    this.chargerFamilleEtMonstre();
    this.filteredFamilles = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  private chargerFamille() {
    this.familleAndMonstreService.getAllFamilles(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.familles = response.data as Famille[];
        this.filteredFamilles = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filter(value))
        );
        this.updateFamilleCourante();
        this.chargerFamilleEtMonstre();
      }
    );
  }

  private chargerFamilleEtMonstre() {
    this.familleAndMonstreService.getFamillesAvecMonstres(this.http).then(
      (data: any) => {
        const response: SpecialResponse = JSON.parse(data) as SpecialResponse;
        this.monstresGroupes = response.data as MonstreGroupe[];
      }
    );
    if (this.monstresGroupes) {
      console.log('Il y a bien un MG');
      this.updateMonstreCourant();
    }
    this.monstreExactMatchV = this.monstreExactMatch();
  }

  private filter(value: string): Famille[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.familles.filter(option => option.libelle.toLowerCase().includes(filterValue));
    }
    return this.familles;
  }

  /* ---------------------------------------------------*
  |                  Partie Monstre                     |
  *-----------------------------------------------------*/
  selectionMonstre($event: Monstre) {
    if (!this.monstreCourrant || this.monstreCourrant.idMonstre !== $event.idMonstre
      || this.monstreCourrant.libelle.toLowerCase() !== $event.libelle.toLowerCase()
      || (this.familleMonstreSelectionne
        && this.familleMonstreSelectionne.libelle !== (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options.item(this.familleMonstreSelectionne.idFamilleMonstre).label)) {
      if (this.familleMonstreSelectionne &&
        this.familleMonstreSelectionne.libelle !== (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options.item(this.familleMonstreSelectionne.idFamilleMonstre).label) {
        console.log('On est rentré en famille !');
      }

      // On met à jour le monstre courant, et on change la selection en JS vanilla. A voir si on peut faire autrement.
      this.monstreCourrant = $event;
      (document.getElementById('monstreLibelle') as HTMLInputElement).value = this.monstreCourrant.libelle;

      // Selection de la famille et affichage en JS vanilla, car je n'arrive pas à le faire sans JS Vanilla.
      this.familleMonstreSelectionne = this.familles.filter(f => +f.idFamilleMonstre === +$event.idFamilleMonstre)[0];
      const familleToSelect: number = this.familleMonstreSelectionne !== undefined ? this.familleMonstreSelectionne.idFamilleMonstre : 0;
      console.log((document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[+familleToSelect].value + ' : ' + (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options.item(+familleToSelect).label + ' => ' + (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[+familleToSelect].selected);
      (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[+familleToSelect].selected = true;
      console.log((document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[+familleToSelect].value + ' : ' + (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options.item(+familleToSelect).label + ' => ' + (document.getElementById('inputFamilleMonstre') as HTMLSelectElement)
        .options[+familleToSelect].selected);
      // Changement de valeur de l'autocomplete des monstres, pour garder un affichage cohérent
      this.autocompleteGroupeMonstre.monstreForm.patchValue({
        monstreGroup: this.monstreCourrant.libelle,
      });
      this.monstreExactMatchV = this.monstreExactMatch();
    }
  }

  public updateMonstreCourant() {
    const libelleCourant: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
    const monstre: Monstre = this.searchExistingMonstreByName(libelleCourant);
    console.log(monstre);
    if (monstre !== undefined) {
      console.log('Monstre === defined');
      this.selectionMonstre(monstre);
    }
  }

  inputMonstreNameAlreadyExist(): boolean {
    if (this.monstresGroupes) {
      const value: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
      const monstre: Monstre = this.searchExistingMonstreByName(value);
      return monstre !== undefined;
    }
    return true;
  }

  monstreExactMatch(): boolean {
    console.log('Je suis dedans');
    console.log(this.monstreCourrant);
    if (this.monstreCourrant) {
      // On cherche si un monstre du même nom existe déja.
      const libelleCourant: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
      const monstre: Monstre = this.searchExistingMonstreByName(libelleCourant);

      // Valeur de la famille choisie dans l'input.
      const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
      const idFamille = +select.options[select.selectedIndex].value !== 0 ? +select.options[select.selectedIndex].value : undefined;

      // Si le monstre existe, et qu'il a la même famille que celle selectionnée, et le même nom que le monstre selectionné.
      console.log('Je vaux : ' + (monstre && monstre.idFamilleMonstre === idFamille
      && (document.getElementById('monstreLibelle') as HTMLInputElement).value === this.monstreCourrant.libelle));
      console.log((document.getElementById('inputFamilleMonstre') as HTMLSelectElement).selectedIndex + ' / ' +
        (document.getElementById('inputFamilleMonstre') as HTMLSelectElement).options[
        (document.getElementById('inputFamilleMonstre') as HTMLSelectElement).selectedIndex].innerHTML);
      return monstre && monstre.idFamilleMonstre === idFamille
        && (document.getElementById('monstreLibelle') as HTMLInputElement).value === this.monstreCourrant.libelle;
    }
    return false;
  }

  searchExistingMonstreByName(monstreLibelle: string): Monstre {
    let monstre: Monstre[] = this.monstresGroupes
      .map(f => {
        for (const membre of f.Membres) {
          if (membre.libelle.toLowerCase() === monstreLibelle.toLowerCase()) {
            return membre;
          }
        }
        return undefined;
      });
    console.log('Je suis ici : ');
    monstre = monstre.filter(element => element !== undefined);
    console.log(monstre[0]);
    return monstre[0];
  }

  modifierMonstre() {
    const libelle: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
    console.log('Modification monstre');

    const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
    const idFamille = select.options[select.selectedIndex].value;
    this.familleAndMonstreService.modifierMonstre(this.http, this.monstreCourrant.idMonstre,
      +idFamille, libelle).then(
      (data: any) => {
        console.log(data);
        this.familleAndMonstreService.getFamillesAvecMonstres(this.http).then(
          (reload: any) => {
            const response: SpecialResponse = JSON.parse(reload) as SpecialResponse;
            this.monstresGroupes = response.data as MonstreGroupe[];
            this.updateMonstreCourant();
          }
        );
      }
    );
  }

  creerMonstre() {
    const libelle: string = (document.getElementById('monstreLibelle') as HTMLInputElement).value;
    console.log('Ajout monstre');
    this.familleAndMonstreService.creerMonstre(this.http, this.familleMonstreSelectionne.idFamilleMonstre, libelle).then(
      (data: any) => {
        console.log(data);
        this.familleAndMonstreService.getFamillesAvecMonstres(this.http).then(
          (reload: any) => {
            const response: SpecialResponse = JSON.parse(reload) as SpecialResponse;
            this.monstresGroupes = response.data as MonstreGroupe[];
            this.updateMonstreCourant();
          }
        );
      }
    );
    this.monstresGroupes = this.familleAndMonstreService.chargerFamillesAvecMonstres(this.http);
  }

  updateFamilleMonstreSelectionnee() {
    const select = (document.getElementById('inputFamilleMonstre') as HTMLSelectElement);
    const idFamille = select.options[select.selectedIndex].value;
    this.familleMonstreSelectionne = this.familles.filter(f => f.idFamilleMonstre === +idFamille)[0];
  }

  emptyMonstre() {
    return (document.getElementById('monstreLibelle') as HTMLInputElement).value.length === 0;
  }

  /* ---------------------------------------------------*
  |                  Partie Famille                     |
  |                  myControl = new FormControl();     |
  |                  familles: Famille[];               |
  |                  familleCourante: Famille;          |
  |                  filteredFamilles: Observable<Famille[]>;|
  *-----------------------------------------------------*/
  selectionFamille(familleAsString: string) {
    const famille = this.searchExistingFamilleByName(familleAsString);
    if (famille && [!this.familleCourante || this.familleCourante.idFamilleMonstre !== famille.idFamilleMonstre
      || this.familleCourante.libelle !== famille.libelle]) {
      this.familleCourante = famille;
      (document.getElementById('familleLibelle') as HTMLInputElement).value = this.familleCourante.libelle;
      // Changement de valeur de l'autocomplete des familles, pour garder un affichage cohérent
      this.myControl.setValue(this.familleCourante.libelle);
    }
  }

  familleExactMatch(): boolean {
    if (this.familleCourante) {
      // On cherche si une famille du même nom existe déja.
      const libelleCourant: string = (document.getElementById('familleLibelle') as HTMLInputElement).value;
      const famille: Famille = this.searchExistingFamilleByName(libelleCourant);

      // Si la famille existe, et le même nom que la famille selectionnée.
      return famille && (document.getElementById('familleLibelle') as HTMLInputElement).value === this.familleCourante.libelle;
    }
    return false;
  }

  public updateFamilleCourante() {
    this.selectionFamille((document.getElementById('familleLibelle') as HTMLInputElement).value);
  }

  searchExistingFamilleByName(familleLibelle: string): Famille {
    const famille: Famille[] = this.familles.filter(f => f.libelle.toLowerCase() === familleLibelle.toLowerCase());
    return famille[0];
  }

  emptyFamille() {
    return (document.getElementById('familleLibelle') as HTMLInputElement).value.length === 0;
  }

  modifierFamille() {
    const libelle: string = (document.getElementById('familleLibelle') as HTMLInputElement).value;
    console.log('Modification famille');
    this.familleAndMonstreService.modifierFamille(this.http, this.familleCourante.idFamilleMonstre, libelle).then(
      (data: any) => {
        this.chargerNouvellesDonnees(data);
      }
    );
  }

  creerFamille() {
    const libelle: string = (document.getElementById('familleLibelle') as HTMLInputElement).value;
    console.log('Ajout famille');
    this.familleAndMonstreService.creerFamille(this.http, libelle).then(
      (data: any) => {
        this.chargerNouvellesDonnees(data);
      }
    );
  }

  private chargerNouvellesDonnees(data: any) {
    console.log(data);
    this.familleAndMonstreService.getAllFamilles(this.http).then(
      (reload: any) => {
        const response: SpecialResponse = JSON.parse(reload) as SpecialResponse;
        this.familles = response.data as Famille[];
        this.filteredFamilles = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filter(value))
        );
        this.chargerFamille();
      }
    );
  }

}
