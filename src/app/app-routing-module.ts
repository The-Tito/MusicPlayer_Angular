import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './components/player/player';
import { Search } from './components/search/search';

const routes: Routes = [
  { path: '', component: Player },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
