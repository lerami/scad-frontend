import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule} from '@angular/material';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CliViewComponent } from './cli-view/cli-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';


@NgModule({
  declarations: [
    AppComponent,
    CliViewComponent,
    AdminViewComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
