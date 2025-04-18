import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';

const routes: Routes = [
  { path: 'aerolineas', component: AerolineasComponent },
  // other routes...
  { path: '', redirectTo: '/aerolineas', pathMatch: 'full' }, // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
