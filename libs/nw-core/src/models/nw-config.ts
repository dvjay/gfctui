export const defaultNwConfig: Readonly<NwConfig> = Object.freeze({
  maxSelectedNodes: 2,
  displayLabel: true,
  autoExpand: false,
  numHops: 2,
  maxNodeCount: 200,
  viewportHeight: 700,
  node: null,
  edge: null
});

export const defaultNwNodeConfig: Readonly<NwNode> = Object.freeze({
  parentKey: "",
  parentRawPath: [],
  nodeIdAttributeKey: "",
  nodeTypeAttributeKey: "",
  nodeTypes: [],
  nodeAttributes: [],
  alerts: []
});

export const defaultNwEdgeConfig: Readonly<NwEdge> = Object.freeze({
  parentKey: "",
  parentRawPath: [],
  edgeIdAttributeKey: "",
  edgeAttributes: []
});

export interface NwConfig {
  maxSelectedNodes: number;
  displayLabel: boolean;
  autoExpand: boolean;
  numHops: number;
  maxNodeCount: number;
  viewportHeight: number;
  node: NwNode | null;
  edge: NwEdge | null;
}

export interface NwNode {
  parentKey: string;
  parentRawPath: string[];
  nodeIdAttributeKey: string;
  nodeTypeAttributeKey: string;
  nodeTypes: NwNodeType[];
  nodeAttributes: NwAttribute[];
  alerts?: NwAlert[];
}

export interface NwEdge {
  parentKey: string;
  parentRawPath: string[];
  edgeIdAttributeKey: string;
  edgeAttributes: NwAttribute[];
}

export interface NwAttribute {
  key: string;
  displayName: string;
  rawPath: string[];
  tooltip: boolean;
}

export interface NwNodeType {
  key: string;
  displayName: string;
  color: string;
  imagePath: string;
}

export interface NwAlert {
  id: string;
  nodeAttributeKey: string;
  valueType: string;
  value: string;
  alertMessage: string;
}
