import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonnageService} from '../services/personnage.service';
import {ObjetService} from '../services/objet.service';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
  selector: 'app-gestion-objet',
  templateUrl: './gestion-objet.component.html',
  styleUrls: ['./gestion-objet.component.scss']
})
export class GestionObjetComponent implements OnInit {

    personnages: Personnage[];
    idPersonnageSelectionne: number;
    currentPersonnage: Personnage;
    objetsIDs: number[] = [];

  constructor(private http: HttpClient,
              private personnageService: PersonnageService,
              private objetService: ObjetService,
              ) { }

  ngOnInit(): void {
      this.personnageService.getAllPersonnages(this.http, true).then(
          (data: any) => {
              const response = data as SpecialResponse;
              this.personnages = response.data as Personnage[];
          }
      );
  }

  selectPersonnage() {
      if (+this.idPersonnageSelectionne !== 0) {
          this.currentPersonnage = this.personnages.find(f => f.idPersonnage === +this.idPersonnageSelectionne);
          this.objetService.getAllObjetsIDs(this.http, 1).then(
              (dataObjet: any) => {
                  const response: SpecialResponse = dataObjet as SpecialResponse;
                  this.objetsIDs = response.data as number[];
              }
          );
      } else {
          this.currentPersonnage = null;
          this.objetsIDs = null;
          // TODO: Récupérer tous les objets non assignés
      }
  }

}
