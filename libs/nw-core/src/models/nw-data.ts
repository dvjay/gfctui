import {SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export enum NodeNeighbourStatus {
  NOT_LOADED,
  LOADING,
  LOADED_AND_EXPANDED,
  LOADED_AND_COLLAPSED,
  LOADING_FAILED
}

export interface INode extends SimulationNodeDatum {
  readonly id: string;
  r: number;
  isDisplay: boolean;
  neighbourStatus: NodeNeighbourStatus;
  sourceIds: Array<NodeId>;
  targetIds: Array<NodeId>;
}

export type NodeId = INode['id'];

export interface INodeAttribute {
  id: string;
  displayName: string;
  rawPath: string;
  value: string;
  isRequired: boolean;
  shouldTooltipDisplay: boolean;
}

export type NodeAttributeId = INodeAttribute['id'];

export interface INodeType {
  id: string;
  displayName: string;
  colorHex: string;
  imagePath: string;
  attributeIds: Set<NodeAttributeId>;
  attributes: Map<NodeAttributeId, INodeAttribute>;
  // alerts: 
}

export interface IEdge extends SimulationLinkDatum<SimulationNodeDatum> {
  index?: number;
  id: string;
  // source: INode | string | undefined;
  // target: INode | string | undefined;
  sourceNodeId: string;
  targetNodeId: string;
  name?: string;
}

export type EdgeId = IEdge['id'];

export interface INwData {
  nodes: Map<NodeId, INode>;
  edges: Map<EdgeId, IEdge>;
}