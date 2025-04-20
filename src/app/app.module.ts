// In app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponent } from './components/common/common.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
// Import but don't declare AeropuertosComponent

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    NavbarComponent,
    // Remove AeropuertosComponent from here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // If you need the component in this module, import it here
    // AeropuertosComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
