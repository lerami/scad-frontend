import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CliViewComponent} from './cli-view/cli-view.component'
import {AdminViewComponent} from './admin-view/admin-view.component'

const routes: Routes = [
  { path: 'cli', component: CliViewComponent },
  { path: 'admin', component: AdminViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
