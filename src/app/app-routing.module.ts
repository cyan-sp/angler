import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { AvionesComponent } from './components/aviones/aviones.component';
import { AeropuertosComponent } from './components/aeropuertos/aeropuertos.component';

const routes: Routes = [
  { path: 'aerolineas', component: AerolineasComponent },
  { path: 'aviones', component: AvionesComponent },
  { path: 'aeropuertos', component: AeropuertosComponent }, // Make sure this line exists
  { path: '', redirectTo: '/aerolineas', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
