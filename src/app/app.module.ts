import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LootTableComponent } from './loot-table/loot-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from './material-module';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AutocompleteGroupeComponent } from './autocomplete-groupe/autocomplete-groupe.component';
import { GestionDropMonstreComponent } from './gestion-drop-monstre/gestion-drop-monstre.component';
import { GestionMonstreComponent } from './gestion-monstre/gestion-monstre.component';
import {
  AdDirective,
  FadingInfoComponent,
  BannerComponent
} from './fading-info/fading-info.component';
import { GestionDropMonstreBisComponent } from './gestion-drop-monstre-bis/gestion-drop-monstre-bis.component';
import { TestLoadJSonComponent } from './test-load-json/test-load-json.component';
import { ArmesComponent } from './objets/armes/armes.component';
import { ArmuresComponent } from './objets/armures/armures.component';
import { AnneauxComponent } from './objets/anneaux/anneaux.component';
import { BatonsComponent } from './objets/batons/batons.component';
import { MaledictionsComponent } from './objets/maledictions/maledictions.component';
import { ObjetsMerveilleuxComponent } from './objets/objets-merveilleux/objets-merveilleux.component';
import { SceptresComponent } from './objets/sceptres/sceptres.component';



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
    TestLoadJSonComponent,
    ArmesComponent,
    ArmuresComponent,
    AnneauxComponent,
    BatonsComponent,
    MaledictionsComponent,
    ObjetsMerveilleuxComponent,
    SceptresComponent,
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
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
