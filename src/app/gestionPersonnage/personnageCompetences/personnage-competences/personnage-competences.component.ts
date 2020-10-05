import {Component, OnInit} from '@angular/core';
import {SavedDataType} from 'beautiful-skill-tree';

@Component({
    selector: 'app-personnage-competences',
    templateUrl: './personnage-competences.component.html',
    styleUrls: ['./personnage-competences.component.scss']
})
export class PersonnageCompetencesComponent implements OnInit {

    public data: SavedDataType;

    constructor() {
    }

    ngOnInit(): void {
    }

    public handleOnClick(data: SavedDataType) {
        // console.log(data);
    }

}
