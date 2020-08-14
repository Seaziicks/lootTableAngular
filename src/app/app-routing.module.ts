import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';


const routes: Routes = [
  {path: 'GestionMonstre', component: GestionMonstreComponent},
  {path: 'LootTable', component: LootTableComponent},
  {path: '', redirectTo: 'LootTable', pathMatch: 'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
