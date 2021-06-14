import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { AppComponent } from './app.component';
import { NetworkGraphModule } from "../../../../libs/nw-components-angular/src/lib/network-graph.module";
import { MatCheckboxModule, MatToolbarModule, 
  MatSelectModule, MatProgressSpinnerModule, 
  MatIconModule, 
  MatSlideToggleModule, 
  MatMenuModule, 
  MatSnackBarModule, 
  MatDividerModule, 
  MatTooltipModule, MatListModule, 
  MatCardModule,} from "@angular/material";
import { OverlayModule } from "@angular/cdk/overlay";
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,

    NetworkGraphModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule, 
    MatToolbarModule, 
    MatSelectModule, 
    MatProgressSpinnerModule, 
    MatIconModule, 
    MatSlideToggleModule, 
    MatMenuModule, 
    MatSnackBarModule, 
    MatDividerModule, 
    MatTooltipModule,
    OverlayModule,
    A11yModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
