import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponent } from './components/common/common.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
// Only add if not standalone:
// import { AvionesComponent } from './components/aviones/aviones.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    NavbarComponent,  // ✅ Must be here (since it's not standalone)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    VuelosComponent,  // ✅ Correct (standalone component)
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }

