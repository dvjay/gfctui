import { defaultNwEdgeConfig, defaultNwNodeConfig, NwAttribute, NwEdge, NwNodeType } from '../models/nw-config';
import { defaultNwConfig, NwConfig, NwNode } from "../models/nw-config";
import { EMPTY_STRING, toBoolean, toPositiveInteger } from "../utils";
// import * as _ from "lodash";

interface NwRawConfig {
  [key: string]: unknown;
}

export class NwConfigParser {
  private nwRawConfig: NwRawConfig | null;
  public nwConfig: NwConfig = {...defaultNwConfig, node: null, edge: null};
  public nwNodeTypes = new Map<string, NwNodeType>();
  public nwNodeTypeRawPath: string[] | undefined;

  constructor(config: NwRawConfig) {
    if(typeof config === 'object') {
      this.nwRawConfig = config;
      //this.nwConfig = this.getDefaultConfig();
      this.setMandatoryConfig();
      this.setNodeConfig();
      this.setNodeTypesConfig();

      this.setEdgeConfig();
      this.setEdgeAttributesConfig();
    } else {
      this.nwRawConfig = null;
      console.error("Invalid config!");
    }
  }

  private setMandatoryConfig() {
    if(typeof this.nwRawConfig === 'object') {
      const rawConfig = this.nwRawConfig as NwRawConfig;

      if(rawConfig) {
        this.nwConfig.maxSelectedNodes = toPositiveInteger(rawConfig.maxSelectedNodes, defaultNwConfig.maxSelectedNodes);
        this.nwConfig.displayLabel = toBoolean(rawConfig.displayLabel, defaultNwConfig.displayLabel);
        this.nwConfig.autoExpand = toBoolean(rawConfig.autoExpand, defaultNwConfig.autoExpand);
        this.nwConfig.numHops = toPositiveInteger(rawConfig.numHops, defaultNwConfig.numHops);
        this.nwConfig.maxNodeCount = toPositiveInteger(rawConfig.maxNodeCount, defaultNwConfig.maxNodeCount);
        this.nwConfig.viewportHeight = toPositiveInteger(rawConfig.viewportHeight, defaultNwConfig.viewportHeight);
        this.nwConfig.nodeRadius = toPositiveInteger(rawConfig.nodeRadius, defaultNwConfig.nodeRadius);
      }
    }
  }

  private setNodeConfig() {
    let nodeRawConfig = (this.nwRawConfig && this.nwRawConfig.node? this.nwRawConfig.node: {}) as NwNode;
    this.nwConfig.node = {...defaultNwNodeConfig};
    if(Array.isArray(nodeRawConfig.parentRawPath)) {
      this.nwConfig.node.parentRawPath = nodeRawConfig.parentRawPath;
    }
    if(typeof nodeRawConfig.nodeIdAttributeKey === 'string') {
      this.nwConfig.node.nodeIdAttributeKey = nodeRawConfig.nodeIdAttributeKey;
    }
    if(typeof nodeRawConfig.nodeTypeAttributeKey === 'string') {
      this.nwConfig.node.nodeTypeAttributeKey = nodeRawConfig.nodeTypeAttributeKey;
    }
    if(typeof nodeRawConfig.nodeTitleAttributeKey === 'string') {
      this.nwConfig.node.nodeTitleAttributeKey = nodeRawConfig.nodeTitleAttributeKey;
    }
  }

  private setNodeTypesConfig() {
    let nodeTypesRawConfig = (this.nwRawConfig && this.nwRawConfig.node && Array.isArray((this.nwRawConfig.node as NwNode).nodeTypes)? 
                              (this.nwRawConfig.node as NwNode).nodeTypes: []) as NwNodeType[];
    for (const nodeTypeFromConfig of nodeTypesRawConfig) {
      let nodeType: NwNodeType;
      let nodeAttributes = [];
      let nodeAttributesRawConfig = Array.isArray(nodeTypeFromConfig.nodeAttributes)? nodeTypeFromConfig.nodeAttributes: [];
      for (const nAttr of nodeAttributesRawConfig) {
        if(nAttr.key === this.nwConfig?.node?.nodeTypeAttributeKey && !Array.isArray(this.nwNodeTypeRawPath)) {
          this.nwNodeTypeRawPath = nAttr.rawPath;
        }
        nodeAttributes.push({
          key: typeof nAttr.key === 'string'? nAttr.key: EMPTY_STRING,
          displayName: typeof nAttr.displayName === 'string'? nAttr.displayName: EMPTY_STRING,
          rawPath: Array.isArray(nAttr.rawPath)? nAttr.rawPath: [],
          tooltip: typeof nAttr.tooltip === 'boolean'? nAttr.tooltip: false
        });
      }

      nodeType = {
        name: typeof nodeTypeFromConfig.name === 'string'? nodeTypeFromConfig.name : EMPTY_STRING,
        displayName: typeof nodeTypeFromConfig.displayName === 'string'? nodeTypeFromConfig.displayName : EMPTY_STRING,
        color: typeof nodeTypeFromConfig.color === 'string'? nodeTypeFromConfig.color : EMPTY_STRING,
        imagePath: typeof nodeTypeFromConfig.imagePath === 'string'? nodeTypeFromConfig.imagePath : EMPTY_STRING,
        nodeAttributes: nodeAttributes
      };
      if(nodeType && typeof nodeType.name === 'string' && nodeType.name.length > 0) {
        this.nwNodeTypes.set(nodeType.name, nodeType);
      }
      if(this.nwConfig?.node?.nodeTypes && Array.isArray(this.nwConfig.node.nodeTypes)) {
        this.nwConfig?.node?.nodeTypes.push(nodeType);
      }
    }
  }

  private setEdgeConfig() {
    let edgeRawConfig = (this.nwRawConfig && this.nwRawConfig.edge? this.nwRawConfig.edge: {}) as NwEdge;
    this.nwConfig.edge = {...defaultNwEdgeConfig};
    if(Array.isArray(edgeRawConfig.parentRawPath)) {
      this.nwConfig.edge.parentRawPath = edgeRawConfig.parentRawPath;
    }
    if(typeof edgeRawConfig.edgeSourceIdAttributeKey === 'string') {
      this.nwConfig.edge.edgeSourceIdAttributeKey = edgeRawConfig.edgeSourceIdAttributeKey;
    }
    if(typeof edgeRawConfig.edgeTargetIdAttributeKey === 'string') {
      this.nwConfig.edge.edgeTargetIdAttributeKey = edgeRawConfig.edgeTargetIdAttributeKey;
    }
    if(typeof edgeRawConfig.edgeTitleAttributeKey === 'string') {
      this.nwConfig.edge.edgeTitleAttributeKey = edgeRawConfig.edgeTitleAttributeKey;
    }
  }

  private setEdgeAttributesConfig() {
    let edgeAttributesRawConfig = (this.nwRawConfig && this.nwRawConfig.edge && Array.isArray((this.nwRawConfig.edge as NwEdge).edgeAttributes)? 
                              (this.nwRawConfig.edge as NwEdge).edgeAttributes: []) as NwAttribute[];
    for (const edgeAttributeFromConfig of edgeAttributesRawConfig) {
      if(this.nwConfig?.edge?.edgeAttributes && Array.isArray(this.nwConfig.edge.edgeAttributes)) {
        this.nwConfig.edge.edgeAttributes.push({
          key: typeof edgeAttributeFromConfig.key === 'string'? edgeAttributeFromConfig.key : EMPTY_STRING,
          displayName: typeof edgeAttributeFromConfig.displayName === 'string'? edgeAttributeFromConfig.displayName : EMPTY_STRING,
          rawPath: Array.isArray(edgeAttributeFromConfig.rawPath)? edgeAttributeFromConfig.rawPath : [],
          tooltip: typeof edgeAttributeFromConfig.tooltip === 'string'? edgeAttributeFromConfig.tooltip : false
        });
      }
    }
  }

  // private getDefaultConfig(): NwConfig {
  //   return {...defaultNwConfig, node: {...defaultNwNodeConfig}, edge: {...defaultNwEdgeConfig}};
  // }
}
