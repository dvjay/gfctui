import { INwData } from "./nw-data";
import { GraphLog } from "./nw-log";

export const NWKEY = 'NW';

export interface State {
    [NWKEY]: NwState;
}

export interface NwState {
    data: INwData;
    rootEntityDataLoading: boolean;
    autoNetworkExplore: boolean;
    autoNetworkExpand: boolean;
    rootEntityId: string | undefined;
    rootNodeId: string | undefined;
    selectedNodes: Node[];
    excludedNodeTypes: string[];
    hideLabel: boolean;
    currentHop: number;
    maxHop: number;
    maxNodes: number;
    skewedNodeLogs: GraphLog[];
    FRDAMLCaseNodeLogs: GraphLog[];
    logs: GraphLog[];
}