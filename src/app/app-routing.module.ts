import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AerolineasComponent } from './components/aerolineas/aerolineas.component';

const routes: Routes = [
  { path: '', redirectTo: '/aerolineas', pathMatch: 'full' },
  { path: 'aerolineas', component: AerolineasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
