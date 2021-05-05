import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FeatureCModule } from '@gfct/nw-components-angular/src/lib/nw-graph';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FeatureCModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
