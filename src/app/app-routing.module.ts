import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';
import {GestionDropMonstreComponent} from './gestion-drop-monstre/gestion-drop-monstre.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';
import {FadingInfoComponent} from './fading-info/fading-info.component';
import {GestionDropMonstreBisComponent} from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';
import {ArmesComponent} from './objets/armes/armes.component';
import {ArmuresComponent} from './objets/armures/armures.component';
import {ObjetSimpleComponent} from './objets/objet-simple/objet-simple.component';
import { TestInsertTableComponent } from './test-insert-table/test-insert-table.component';
import {PersonnageObjetComponent} from './personnage-objet/personnage-objet.component';
import {PersonnageComponent} from './personnage/personnage.component';


const routes: Routes = [
    {path: 'testPersonnage', component: PersonnageComponent},
    {path: 'testPersonnageObjet', component: PersonnageObjetComponent},
    {path: 'testTable', component: TestInsertTableComponent},
    {path: 'testObjet', component: ObjetSimpleComponent},
    {path: 'testArmures', component: ArmuresComponent},
    {path: 'testArmes', component: ArmesComponent},
    {path: 'testBanner', component: FadingInfoComponent},
    {path: 'GestionMonstre', component: GestionMonstreComponent},
    {path: 'GestionDropMonstre', component: GestionDropMonstreComponent},
    {path: 'GestionDropMonstreBis', component: GestionDropMonstreBisComponent},
    {path: 'LootTable', component: LootTableComponent},
    {path: '', redirectTo: 'LootTable', pathMatch: 'full'},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
