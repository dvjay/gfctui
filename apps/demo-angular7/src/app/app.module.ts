import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NetworkGraphModule } from "../../../../libs/nw-components-angular/src/lib/network-graph.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NetworkGraphModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
