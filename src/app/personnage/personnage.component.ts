import { Component, OnInit } from '@angular/core';
import {SpecialResponse} from '../loot-table/loot-table.component';
import {ObjetCommunDB} from '../interface/MonstreGroupe';
import {HttpClient} from '@angular/common/http';
import {ObjetService} from '../services/objet.service';

@Component({
  selector: 'app-personnage',
  templateUrl: './personnage.component.html',
  styleUrls: ['./personnage.component.scss']
})
export class PersonnageComponent implements OnInit {

    objetsIDs: number[] = [];

  constructor(private http: HttpClient,
              private objetService: ObjetService) { }

  ngOnInit(): void {
      this.objetService.getObjetsIDs(this.http, 1).then(
          (dataObjet: any) => {
              const response: SpecialResponse = dataObjet as SpecialResponse;
              console.log(response);
              this.objetsIDs = response.data as number[];
              console.log(this.objetsIDs);
          }
      );
  }

}
