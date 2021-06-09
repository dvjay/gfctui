// import { metaReducers } from './reducers/index';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container.component';
import { GraphComponent } from './components/graph/graph.component';
import { StoreModule } from '@ngrx/store';
import { nwReducer, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NwEffects } from './effects';

const envProd = false;

function rootReducerFactory() {
  return nwReducer;
}

@NgModule({
  declarations: [ContainerComponent, GraphComponent],
  imports: [CommonModule, 
    StoreModule.forRoot({} as any, 
      { reducerFactory: rootReducerFactory, metaReducers }), 
       !envProd ? StoreDevtoolsModule.instrument() : [], 
       EffectsModule.forRoot([NwEffects])],
  exports: [ContainerComponent],
})
export class NwGraphModule {}
