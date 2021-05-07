import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NwGraphModule } from '@gfct/nw-components-angular/src/lib/nw-graph';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NwGraphModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
