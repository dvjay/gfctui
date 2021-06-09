import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as NwActions from '../actions';

@Injectable()
export class NwEffects {
  expandNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NwActions.ExpandNode),
        tap(() => console.log("Some Node Expanded"))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {
  }
}