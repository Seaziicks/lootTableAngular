import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DialogContentDialogComponent, LootTableComponent} from './loot-table/loot-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from './material-module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AutocompleteGroupeComponent} from './autocomplete-groupe/autocomplete-groupe.component';
import {GestionDropMonstreComponent} from './gestion-drop-monstre/gestion-drop-monstre.component';
import {GestionMonstreComponent} from './gestion-monstre/gestion-monstre.component';
import {
    AdDirective,
    FadingInfoComponent,
    BannerComponent
} from './fading-info/fading-info.component';
import {GestionDropMonstreBisComponent} from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';
import {ArmesComponent} from './creationObjets/armes/armes.component';
import {ArmuresComponent} from './creationObjets/armures/armures.component';
import {MaledictionsComponent} from './creationObjets/maledictions/maledictions.component';
import {ObjetSimpleComponent} from './creationObjets/objet-simple/objet-simple.component';
import {TestInsertTableComponent} from './test-insert-table/test-insert-table.component';
import {PersonnageComponent} from './gestionPersonnage/personnage/personnage.component';
import {PersonnageObjetComponent} from './gestionObjets/personnage-objet/personnage-objet.component';
import {GestionObjetComponent} from './gestionObjets/gestion-objet/gestion-objet.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {PersonnageObjetPersonnageComponent} from './gestionPersonnage/personnage-objet-personnage/personnage-objet-personnage.component';
import {UserLoginComponent} from './user/user-login/user-login.component';
import {AuthService} from './auth/auth.service';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {UserDisconnectComponent} from './user/user-disconnect/user-disconnect.component';
import {UnauthorizedUserComponent} from './user/unauthorized-user/unauthorized-user.component';
import {ProprieteMagiqueComponent} from './creationObjets/propriete-magique/propriete-magique.component';
import {InformationSnackBarComponent, ProgressionPersonnageComponent} from './progression-personnage/progression-personnage.component';
import { GestionNiveauJoueurComponent } from './gestionPersonnage/gestion-niveau-joueur/gestion-niveau-joueur.component';
import { GestionNiveauxComponent } from './gestion-niveaux/gestion-niveaux.component';
import { SourcesComponent } from './sources/sources.component';
import { PersonnageCompetencesComponent } from './gestionPersonnage/personnageCompetences/personnage-competences/personnage-competences.component';
import {MyComponentWrapperComponent} from './gestionPersonnage/personnageCompetences/MyReactComponentWrapper';
import {ModifierCompetenceComponent} from './gestionPersonnage/personnageCompetences/modifier-competence/modifier-competence.component';
import {CompetenceComponent} from './gestionPersonnage/personnageCompetences/competence/competence.component';


@NgModule({
    declarations: [
        AppComponent,
        LootTableComponent,
        AutocompleteGroupeComponent,
        GestionDropMonstreComponent,
        GestionMonstreComponent,
        FadingInfoComponent,
        AdDirective,
        BannerComponent,
        GestionDropMonstreBisComponent,
        ArmesComponent,
        ArmuresComponent,
        MaledictionsComponent,
        ObjetSimpleComponent,
        TestInsertTableComponent,
        PersonnageComponent,
        PersonnageObjetComponent,
        GestionObjetComponent,
        SpinnerComponent,
        PersonnageObjetPersonnageComponent,
        UserLoginComponent,
        UserCreateComponent,
        UserDisconnectComponent,
        UnauthorizedUserComponent,
        ProprieteMagiqueComponent,
        DialogContentDialogComponent,
        ProgressionPersonnageComponent,
        InformationSnackBarComponent,
        GestionNiveauJoueurComponent,
        GestionNiveauxComponent,
        SourcesComponent,
        PersonnageCompetencesComponent,
        MyComponentWrapperComponent,
        ModifierCompetenceComponent,
        ModifierCompetenceComponent,
        CompetenceComponent,
        CompetenceComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        HttpClientModule,
        DemoMaterialModule,
        MatNativeDateModule,
        FlexLayoutModule,
    ],
    entryComponents: [],
    bootstrap: [AppComponent],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
        AuthService,
    ]
})
export class AppModule {
}
