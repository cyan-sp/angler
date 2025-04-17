import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';
import { AeropuertosComponent} from './components/aeropuertos/aeropuertos.component';


const routes: Routes = [
  { path: 'aerolineas', component: AerolineasComponent },
  { path: '', redirectTo: '/aerolineas', pathMatch: 'full' }, // Default route redirects to aerolineas
  // Leave these commented until you create the components
  { path: 'aeropuertos', component: AeropuertosComponent },
  // { path: 'aviones', component: AvionesComponent },
  // { path: 'vuelos', component: VuelosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })], // enableTracing helps debug routing issues
  exports: [RouterModule]
})
export class AppRoutingModule { }
