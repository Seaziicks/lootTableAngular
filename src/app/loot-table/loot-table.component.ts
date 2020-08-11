import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

/**
 * @title Option groups autocomplete
 */
@Component({
  selector: 'app-loot-table',
  templateUrl: './loot-table.component.html',
  styleUrls: ['./loot-table.component.scss']
})
export class LootTableComponent implements OnInit {

   idMonstre = -1;

  animalForm: FormGroup;

  species = [
    'Castor',
    'Cat',
    'Dog',
    'Dragon',
    'Horse',
    'Snake'
  ];

  speciesGroup: SpeciesGroup[] = [
    {
      letter : 'C',
      name : [ 'Castor', 'Cat']
    },
    {
      letter : 'D',
      name : [ 'Dog', 'Dragon']
    }
  ];

  speciesOptions: Observable<string[]>;
  speciesGroupeOptions: Observable<SpeciesGroup[]>;

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.speciesOptions = this.animalForm.get('species').valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.speciesGroupeOptions = this.animalForm.get('speciesGroup').valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterGroup(val))
      );
  }

  filter(val: string): string[] {
    const res = this.species.filter(name =>
      name.toLowerCase().indexOf(val) === 0);
    return res;
  }

  filterGroup(val: string): SpeciesGroup[] {
    if (val) {
      return this.speciesGroup
        .map(group => ({ letter: group.letter, name: this._filter(group.name, val) }))
        .filter(group => group.name.length > 0);
    }

    return this.speciesGroup;
  }

  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }

  buildForm() {
    this.animalForm = this.fb.group({
      species: ['', [Validators.required]],
      speciesGroup: ['', [Validators.required]]
    });
  }
}

class SpeciesGroup {
  letter: string;
  name: string[];
}
