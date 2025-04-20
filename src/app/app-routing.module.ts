import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { AeropuertosComponent } from './components/aeropuertos/aeropuertos.component';

const routes: Routes = [
  { path: 'aerolineas', component: AerolineasComponent },
  { path: 'aeropuertos', component: AeropuertosComponent },
  // other routes...
  { path: '', redirectTo: '/aerolineas', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
