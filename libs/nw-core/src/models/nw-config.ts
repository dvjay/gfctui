export const defaultNwConfig: Readonly<NwConfig> = Object.freeze({
  maxSelectedNodes: 2,
  displayLabel: true,
  autoExpand: false,
  numHops: 2,
  maxNodeCount: 200,
  viewportHeight: 700,
  nodeRadius: 20,
  node: null,
  edge: null
});

export const defaultNwNodeConfig: Readonly<NwNode> = Object.freeze({
  parentRawPath: [],
  nodeIdAttributeKey: "",
  nodeTypeAttributeKey: "",
  nodeTitleAttributeKey: "",
  nodeTypes: []
});

export const defaultNwEdgeConfig: Readonly<NwEdge> = Object.freeze({
  parentRawPath: [],
  edgeSourceIdAttributeKey: "",
  edgeTargetIdAttributeKey: "",
  edgeTitleAttributeKey: "",
  edgeAttributes: []
});

export interface NwConfig {
  maxSelectedNodes: number;
  displayLabel: boolean;
  autoExpand: boolean;
  numHops: number;
  maxNodeCount: number;
  viewportHeight: number;
  nodeRadius: number;
  node: NwNode | null;
  edge: NwEdge | null;
}

export interface NwNode {
  parentRawPath: string[];
  nodeIdAttributeKey: string;
  nodeTypeAttributeKey: string;
  nodeTitleAttributeKey: string;
  nodeTypes: NwNodeType[];
}

export interface NwEdge {
  parentRawPath: string[];
  edgeSourceIdAttributeKey: string;
  edgeTargetIdAttributeKey: string;
  edgeTitleAttributeKey: string;
  edgeAttributes: NwAttribute[];
}

export interface NwNodeType {
  name: string;
  displayName: string;
  color: string;
  imagePath: string;
  nodeAttributes: NwAttribute[];
}
export interface NwAttribute {
  key: string;
  displayName: string;
  rawPath: string[];
  tooltip: boolean;
}
