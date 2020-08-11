import { Component, OnInit } from '@angular/core';
import {AutocompleteOptgroupComponent} from '../autocomplete-optgroup/autocomplete-optgroup.component';

@Component({
  selector: 'app-loot-table',
  templateUrl: './loot-table.component.html',
  styleUrls: ['./loot-table.component.scss']
})
export class LootTableComponent implements OnInit {

   idMonstre = -1;
  private autoComplete: AutocompleteOptgroupComponent;
   stateForm = this.autoComplete.stateForm;
   stateGroupOptions = this.autoComplete.stateGroupOptions;

  constructor(autoComplete: AutocompleteOptgroupComponent) { }

  ngOnInit(): void {
  }

}
