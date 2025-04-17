import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { CommonComponent } from './components/common/common.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
// import { NavbarComponent } from './components/common/navbar/navbar.component';
// import { NavbarComponent } from './components/common/navbar/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AerolineasComponent,
    CommonComponent,
    NavbarComponent,
    // NavbarComponent,
    // NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
