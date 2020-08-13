import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

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
    this.monstreGroupOptions = this.monstreForm.get('monstreGroup').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
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

