import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponent } from './components/common/common.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
// Only add if not standalone:
// import { AvionesComponent } from './components/aviones/aviones.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    NavbarComponent,
    // Only add if not standalone:
    // AvionesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
