import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LootTableComponent} from './loot-table/loot-table.component';
import {GestionDropMonstreComponent} from './gestion-drop-monstre/gestion-drop-monstre.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';
import {FadingInfoComponent} from './fading-info/fading-info.component';
import {GestionDropMonstreBisComponent} from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';
import {ArmesComponent} from './creationObjets/armes/armes.component';
import {ArmuresComponent} from './creationObjets/armures/armures.component';
import {ObjetSimpleComponent} from './creationObjets/objet-simple/objet-simple.component';
import { TestInsertTableComponent } from './test-insert-table/test-insert-table.component';
import {PersonnageObjetComponent} from './gestionObjets/personnage-objet/personnage-objet.component';
import {PersonnageComponent} from './gestionPersonnage/personnage/personnage.component';
import {GestionObjetComponent} from './gestionObjets/gestion-objet/gestion-objet.component';
import {UserLoginComponent} from './user/user-login/user-login.component';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {AuthGuard} from './auth/auth.guard';
import {UserDisconnectComponent} from './user/user-disconnect/user-disconnect.component';
import {UnauthorizedUserComponent} from './user/unauthorized-user/unauthorized-user.component';
import {ProgressionPersonnageComponent} from './progression-personnage/progression-personnage.component';
import {GestionNiveauJoueurComponent} from './gestionPersonnage/gestion-niveau-joueur/gestion-niveau-joueur.component';
import {GestionNiveauxComponent} from './gestion-niveaux/gestion-niveaux.component';
import {SourcesComponent} from './sources/sources.component';
import {PersonnageCompetencesComponent} from './gestionPersonnage/personnageCompetences/personnage-competences/personnage-competences.component';


const routes: Routes = [
    {path: 'competences/:idPersonnage', component: PersonnageCompetencesComponent},
    {path: 'niveau/:idPersonnage', component: GestionNiveauJoueurComponent},
    {path: 'progression', component: ProgressionPersonnageComponent},
    {path: 'unauthorized', component: UnauthorizedUserComponent},
    {path: 'deconnexion', component: UserDisconnectComponent},
    {path: 'signin', component: UserCreateComponent},
    {path: 'login', component: UserLoginComponent},
    {path: 'testPersonnage', component: PersonnageComponent},
    {path: 'testPersonnageObjet', component: PersonnageObjetComponent},
    {path: 'testTable', component: TestInsertTableComponent},
    {path: 'testObjet', component: ObjetSimpleComponent},
    {path: 'testArmures', component: ArmuresComponent},
    {path: 'testArmes', component: ArmesComponent},
    {path: 'testBanner', component: FadingInfoComponent},
    {path: 'GestionNiveaux', component: GestionNiveauxComponent},
    {path: 'GestionObjets', component: GestionObjetComponent, canActivate: [AuthGuard]},
    {path: 'GestionMonstre', component: GestionMonstreComponent, canActivate: [AuthGuard]},
    {path: 'GestionDropMonstre', component: GestionDropMonstreComponent, canActivate: [AuthGuard]},
    {path: 'GestionDropMonstreBis', component: GestionDropMonstreBisComponent, canActivate: [AuthGuard]},
    {path: 'LootTable', component: LootTableComponent, canActivate: [AuthGuard]},
    {path: 'sources', component: SourcesComponent},
    {path: '', redirectTo: '/testPersonnage', pathMatch: 'full'},
    {path: '**', redirectTo: '/testPersonnage'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
