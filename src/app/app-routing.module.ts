import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';
import {GestionDropMonstreComponent} from './gestion-drop-monstre/gestion-drop-monstre.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';
import {FadingInfoComponent} from './fading-info/fading-info.component';
import {GestionDropMonstreBisComponent} from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';
import {TestLoadJSonComponent} from './test-load-json/test-load-json.component';
import {ArmesComponent} from './objets/armes/armes.component';
import {ArmuresComponent} from './objets/armures/armures.component';
import {AnneauxComponent} from './objets/anneaux/anneaux.component';
import {ObjetsMerveilleuxComponent} from './objets/objets-merveilleux/objets-merveilleux.component';
import {BatonsComponent} from './objets/batons/batons.component';
import {SceptresComponent} from './objets/sceptres/sceptres.component';
import {ObjetSimpleComponent} from './objets/objet-simple/objet-simple.component';


const routes: Routes = [
    {path: 'testObjet', component: ObjetSimpleComponent},
    {path: 'testSceptres', component: SceptresComponent},
    {path: 'testBatons', component: BatonsComponent},
    {path: 'testObjetsMerveilleux', component: ObjetsMerveilleuxComponent},
    {path: 'testAnneaux', component: AnneauxComponent},
    {path: 'testArmures', component: ArmuresComponent},
    {path: 'testArmes', component: ArmesComponent},
    {path: 'testJSon', component: TestLoadJSonComponent},
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
export class AppRoutingModule {
}
