import {Component, Input, OnInit, Output, EventEmitter, ViewChildren, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';

export const filter = (opt: Monstre[], value: string): Monstre[] => {
  const filterValue = value.toLowerCase().trim();

  return opt.filter(item => item.libelle.toLowerCase().trim().indexOf(filterValue) !== -1);
};

/**
 * @title Option groups autocomplete
 */
@Component({
  selector: 'app-autocomplete-groupe',
  templateUrl: './autocomplete-groupe.component.html',
  styleUrls: ['./autocomplete-groupe.component.scss']
})
export class AutocompleteGroupeComponent implements OnInit {

  monstreForm: FormGroup = this.formBuilder.group({
    monstreGroup: '',
  });
  @Input() monsterGroupes: MonstreGroupe[];
  @Output() monstreEventEmitter = new EventEmitter<Monstre>();

  monstreGroupOptions: Observable<MonstreGroupe[]>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    // Je mets un setTimeout ici car sinon l'affichage des possibilités ne se fait pas quand la page vient de se charger
    // et que l'on clique sur l'élément. On est obligé de taper une lettre pour que celle-ci se fasse.
    // setTimout semble éviter ce disfonctionnement.
    setTimeout( () => {
      this.monstreGroupOptions = this.monstreForm.get('monstreGroup').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroup(value))
        );
    }, 100);
  }

  private _filterGroup(value: string): MonstreGroupe[] {
    if (value) {
      return this.monsterGroupes
        .map(group => ({Famille: group.Famille, Membres: filter(group.Membres, value)}))
        .filter(group => group.Membres.length > 0);
    }

    return this.monsterGroupes;
  }

  selection(monstre: Monstre) {
    this.monstreEventEmitter.emit(monstre);
  }

  handleEmpty() {
    // alert((event.srcElement as Element).nodeValue);
  }
}

