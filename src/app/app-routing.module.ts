import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';


const routes: Routes = [
  {path: 'LootTable', component: LootTableComponent},
  {path: '', redirectTo: 'LootTable', pathMatch: 'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
