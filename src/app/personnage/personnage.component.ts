import { Component, OnInit } from '@angular/core';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../services/objet.service';

@Component({
  selector: 'app-personnage',
  templateUrl: './personnage.component.html',
  styleUrls: ['./personnage.component.scss']
})
export class PersonnageComponent implements OnInit {

  constructor(private http: HttpClient,
              private objetService: ObjetService) { }

  ngOnInit(): void {

  }

}
