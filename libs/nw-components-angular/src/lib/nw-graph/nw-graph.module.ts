import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container.component';
import { GraphComponent } from './components/graph/graph.component';

@NgModule({
  declarations: [ContainerComponent, GraphComponent],
  imports: [CommonModule],
  exports: [ContainerComponent],
})
export class NwGraphModule {}
