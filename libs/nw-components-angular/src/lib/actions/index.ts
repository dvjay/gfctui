import { createAction, props } from '@ngrx/store';
// import { INode, IEdge } from '@gfct/nw-core/src/models/nw-data';
import { INode, IEdge } from '../../../../../nw-core/src/models/nw-data';

export const ExpandNode = createAction(
  '[NW]EXPAND_NODE',
  props<{
    payload: {
      nodeId: string;
      currentVisibleNodes: INode[];
      currentVisibleEdges: IEdge[];
    };
  }>()
);

export const SelectNode = createAction(
  '[NW]SELECT_NODE',
  props<{payload: string}>()
);