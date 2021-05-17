import {SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export enum NodeNeighbourStatus {
  NOT_LOADED,
  LOADING,
  LOADED_AND_EXPANDED,
  LOADED_AND_COLLAPSED,
  LOADING_FAILED
}

export interface INode extends SimulationNodeDatum {
  id?: string;
  type?: string;
  title?: string;
  r?: number;
  neighbourStatus?: NodeNeighbourStatus;
  sourceIds?: Array<NodeId>;
  targetIds?: Array<NodeId>;
  [key: string]: any;
}

export type NodeId = INode['id'];

export interface INodeAttribute {
  key: string;
  displayName: string;
  rawPath: string;
  tooltip: boolean;
}

export type NodeAttributeId = INodeAttribute['key'];

export interface INodeType {
  name: string;
  displayName: string;
  color: string;
  imagePath: string;
  nodeAttributes: INodeAttribute[];
  // alerts: 
}

export interface IEdge extends SimulationLinkDatum<SimulationNodeDatum> {
  index?: number;
  id: string;
  source: string;
  target: string;
  // sourceNodeId: string;
  // targetNodeId: string;
  title?: string;
  [key: string]: any;
}

export type EdgeId = IEdge['id'];

export interface INwData {
  nodes: Map<NodeId, INode>;
  edges: Map<EdgeId, IEdge>;
}