import {Component, Input, OnInit} from '@angular/core';
import {ObjetService} from '../services/objet.service';
import {ObjetCommunDB} from '../interface/MonstreGroupe';
import {HttpClient} from '@angular/common/http';
import {SpecialResponse} from '../loot-table/loot-table.component';

@Component({
    selector: 'app-personnage-objet',
    templateUrl: './personnage-objet.component.html',
    styleUrls: ['./personnage-objet.component.scss']
})
export class PersonnageObjetComponent implements OnInit {

    @Input() id: number;

    objet: ObjetCommunDB;

    constructor(private http: HttpClient,
                private objetService: ObjetService) { }

    ngOnInit(): void {
        this.objetService.getObjetComplet(this.http, this.id).then(
            (dataObjet: any) => {
                const response: SpecialResponse = dataObjet as SpecialResponse;
                console.log(response);
                this.objet = response.data as unknown as ObjetCommunDB;
                console.log(this.objet);
            }
        );
    }

}
