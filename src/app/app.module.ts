import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule,  MatFormFieldModule, MatInputModule} from '@angular/material';
import 'hammerjs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CliViewComponent } from './cli-view/cli-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { CliLoginComponent } from './cli-login/cli-login.component';


@NgModule({
  declarations: [
    AppComponent,
    CliViewComponent,
    AdminViewComponent,
    CliLoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
