import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';
import {GestionDropMonstreComponent} from './gestion-drop-monstre/gestion-drop-monstre.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';
import {FadingInfoComponent} from './fading-info/fading-info.component';
import {GestionDropMonstreBisComponent} from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';


const routes: Routes = [
  {path: 'testBanner', component: FadingInfoComponent},
  {path: 'GestionMonstre', component: GestionMonstreComponent},
  {path: 'GestionDropMonstre', component: GestionDropMonstreComponent},
  {path: 'GestionDropMonstreBis', component: GestionDropMonstreBisComponent},
  {path: 'LootTable', component: LootTableComponent},
  {path: '', redirectTo: 'LootTable', pathMatch: 'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
