import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Remove AerolineasComponent from here since it's standalone
import { CommonComponent } from './components/common/common.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    // Remove AerolineasComponent from here
    CommonComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // You don't need to import standalone components here either
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
