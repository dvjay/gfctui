import * as NwActions from '../actions';
// import { NwState }from '@gfct/nw-core/src/models/nw-state';
import { NwState }from '../../../../../nw-core/src/models/nw-state';
// import { NodeId, INode, EdgeId, IEdge } from '@gfct/nw-core/src/models/nw-data';
import { NodeId, INode, EdgeId, IEdge } from '../../../../../nw-core/src/models/nw-data';
import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';

const envProd = false;

const initialState: NwState = {
  data: { nodes: new Map<NodeId, INode>(), edges: new Map<EdgeId, IEdge>()},
  rootEntityDataLoading: false,
  autoNetworkExplore: false,
  autoNetworkExpand: false,
  rootEntityId: undefined,
  rootNodeId: undefined,
  selectedNodes: [],
  excludedNodeTypes: [],
  hideLabel: false,
  currentHop: 2,
  maxHop: 2,
  maxNodes: 200,
  skewedNodeLogs: [],
  FRDAMLCaseNodeLogs: [],
  logs: []
}

export const nwReducer = createReducer(
  initialState,
  on(NwActions.ExpandNode, (state) => {
    return state;
  }),
  on(NwActions.SelectNode, (state) => {
    return state;
  })
);

// export default function reducer(state: NwState = initialState, action: Actions): NwState {
//   switch (action.type) {
//     case ActionTypes.EXPAND_NODE:
//       return state;
//     case ActionTypes.SELECT_NODE:
//       return state;
//     default:
//       return state;
//   }
// }

// export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('Root reducers token', {
//   factory: () => ({
//     [NWKEY]: reducer,
//   }),
// });

export function logger(reducer: ActionReducer<NwState>): ActionReducer<NwState> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  }
}

export const metaReducers: MetaReducer<NwState>[] = !envProd ? [logger]: [];