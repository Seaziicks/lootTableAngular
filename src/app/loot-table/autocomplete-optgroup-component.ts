import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

/**
 * @title Option groups autocomplete
 */
@Component({
  selector: 'app-autocomplete-optgroup-component',
  templateUrl: './autocomplete-optgroup-component.html',
})

export class AutocompleteOptgroupComponent implements OnInit {
  monstreForm: FormGroup = this.formBuilder.group({
    monstreGroup: '',
  });
  @Input() monsterGroupes: MonstreGroupe[];

  monstreGroupOptions: Observable<MonstreGroupe[]>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.monstreGroupOptions = this.monstreForm.get('monstreGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): MonstreGroupe[] {
    if (value) {
      return this.monsterGroupes
        .map(group => ({letter: group.letter, names: filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.monsterGroupes;
  }
}
