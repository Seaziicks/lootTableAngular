import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LootTableComponent} from './loot-table/loot-table.component';
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
import {ArmesComponent} from './objets/armes/armes.component';
import {ArmuresComponent} from './objets/armures/armures.component';
import {MaledictionsComponent} from './objets/maledictions/maledictions.component';
import {ObjetSimpleComponent} from './objets/objet-simple/objet-simple.component';
import {TestInsertTableComponent} from './test-insert-table/test-insert-table.component';
import {PersonnageComponent} from './personnage/personnage.component';
import {PersonnageObjetComponent} from './personnage-objet/personnage-objet.component';
import {GestionObjetComponent} from './gestion-objet/gestion-objet.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {PersonnageObjetPersonnageComponent} from './personnage-objet-personnage/personnage-objet-personnage.component';


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
    ]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
