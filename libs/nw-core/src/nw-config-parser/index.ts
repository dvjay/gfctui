import { defaultNwAttribute, defaultNwEdgeConfig, defaultNwNodeConfig, NwAttribute, NwEdge, NwNodeType } from '../models/nw-config';
import { defaultNwConfig, NwConfig, NwNode } from "../models/nw-config";
import { EMPTY_STRING, isArrayOfNonEmptyStrings, isStringNullorEmpty, toBoolean, toPositiveInteger } from "../utils";
// import * as _ from "lodash";

interface NwRawConfig {
  [key: string]: unknown;
}

export class NwConfigParser {
  private nwRawConfig: NwRawConfig | null;
  public nwConfig: NwConfig = {...defaultNwConfig, node: null, edge: null};
  public nwNodeTypes = new Map<string, NwNodeType>();

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
    if(isArrayOfNonEmptyStrings(nodeRawConfig.parentRawPath)) {
      this.nwConfig.node.parentRawPath = nodeRawConfig.parentRawPath;
    } else {
      console.error("Invalid parentRawPath for Nodes");
    }
    if(isArrayOfNonEmptyStrings(nodeRawConfig?.nodeIdAttribute?.rawPath)) {
      this.nwConfig.node.nodeIdAttribute = {...defaultNwAttribute};
      this.nwConfig.node.nodeIdAttribute.rawPath = nodeRawConfig?.nodeIdAttribute?.rawPath;
      !isStringNullorEmpty(nodeRawConfig?.nodeIdAttribute?.key)? this.nwConfig.node.nodeIdAttribute.key = nodeRawConfig?.nodeIdAttribute?.key : null;
      !isStringNullorEmpty(nodeRawConfig?.nodeIdAttribute?.displayName)? this.nwConfig.node.nodeIdAttribute.displayName = nodeRawConfig?.nodeIdAttribute?.displayName : null;
      typeof nodeRawConfig?.nodeIdAttribute?.tooltip === 'boolean'? this.nwConfig.node.nodeIdAttribute.tooltip = nodeRawConfig?.nodeIdAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in nodeIdAttribute");
    }
    if(isArrayOfNonEmptyStrings(nodeRawConfig?.nodeTypeAttribute?.rawPath)) {
      this.nwConfig.node.nodeTypeAttribute = {...defaultNwAttribute};
      this.nwConfig.node.nodeTypeAttribute.rawPath = nodeRawConfig?.nodeTypeAttribute?.rawPath;
      !isStringNullorEmpty(nodeRawConfig?.nodeTypeAttribute?.key)? this.nwConfig.node.nodeTypeAttribute.key = nodeRawConfig?.nodeTypeAttribute?.key : null;
      !isStringNullorEmpty(nodeRawConfig?.nodeTypeAttribute?.displayName)? this.nwConfig.node.nodeTypeAttribute.displayName = nodeRawConfig?.nodeTypeAttribute?.displayName : null;
      typeof nodeRawConfig?.nodeTypeAttribute?.tooltip === 'boolean'? this.nwConfig.node.nodeTypeAttribute.tooltip = nodeRawConfig?.nodeTypeAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in nodeTypeAttribute");
    }
    if(isArrayOfNonEmptyStrings(nodeRawConfig?.nodeTitleAttribute?.rawPath)) {
      this.nwConfig.node.nodeTitleAttribute = {...defaultNwAttribute};
      this.nwConfig.node.nodeTitleAttribute.rawPath = nodeRawConfig?.nodeTitleAttribute?.rawPath;
      !isStringNullorEmpty(nodeRawConfig?.nodeTitleAttribute?.key)? this.nwConfig.node.nodeTitleAttribute.key = nodeRawConfig?.nodeTitleAttribute?.key : null;
      !isStringNullorEmpty(nodeRawConfig?.nodeTitleAttribute?.displayName)? this.nwConfig.node.nodeTitleAttribute.displayName = nodeRawConfig?.nodeTitleAttribute?.displayName : null;
      typeof nodeRawConfig?.nodeTitleAttribute?.tooltip === 'boolean'? this.nwConfig.node.nodeTitleAttribute.tooltip = nodeRawConfig?.nodeTitleAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in nodeTitleAttribute");
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

    if(this.nwConfig?.edge?.parentRawPath && isArrayOfNonEmptyStrings(edgeRawConfig.parentRawPath)) {
      this.nwConfig.edge.parentRawPath = edgeRawConfig.parentRawPath;
    } else {
      console.error("Invalid parentRawPath for Edges");
    }

    if(isArrayOfNonEmptyStrings(edgeRawConfig?.edgeSourceIdAttribute?.rawPath)) {
      this.nwConfig.edge.edgeSourceIdAttribute = {...defaultNwAttribute};
      this.nwConfig.edge.edgeSourceIdAttribute.rawPath = edgeRawConfig?.edgeSourceIdAttribute?.rawPath;
      !isStringNullorEmpty(edgeRawConfig?.edgeSourceIdAttribute?.key)? this.nwConfig.edge.edgeSourceIdAttribute.key = edgeRawConfig?.edgeSourceIdAttribute?.key : null;
      !isStringNullorEmpty(edgeRawConfig?.edgeSourceIdAttribute?.displayName)? this.nwConfig.edge.edgeSourceIdAttribute.displayName = edgeRawConfig?.edgeSourceIdAttribute?.displayName : null;
      typeof edgeRawConfig?.edgeSourceIdAttribute?.tooltip === 'boolean'? this.nwConfig.edge.edgeSourceIdAttribute.tooltip = edgeRawConfig?.edgeSourceIdAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in edgeSourceIdAttribute");
    }

    if(isArrayOfNonEmptyStrings(edgeRawConfig?.edgeTargetIdAttribute?.rawPath)) {
      this.nwConfig.edge.edgeTargetIdAttribute = {...defaultNwAttribute};
      this.nwConfig.edge.edgeTargetIdAttribute.rawPath = edgeRawConfig?.edgeTargetIdAttribute?.rawPath;
      !isStringNullorEmpty(edgeRawConfig?.edgeTargetIdAttribute?.key)? this.nwConfig.edge.edgeTargetIdAttribute.key = edgeRawConfig?.edgeTargetIdAttribute?.key : null;
      !isStringNullorEmpty(edgeRawConfig?.edgeTargetIdAttribute?.displayName)? this.nwConfig.edge.edgeTargetIdAttribute.displayName = edgeRawConfig?.edgeTargetIdAttribute?.displayName : null;
      typeof edgeRawConfig?.edgeTargetIdAttribute?.tooltip === 'boolean'? this.nwConfig.edge.edgeTargetIdAttribute.tooltip = edgeRawConfig?.edgeTargetIdAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in edgeTargetIdAttribute");
    }

    if(isArrayOfNonEmptyStrings(edgeRawConfig?.edgeTitleAttribute?.rawPath)) {
      this.nwConfig.edge.edgeTitleAttribute = {...defaultNwAttribute};
      this.nwConfig.edge.edgeTitleAttribute.rawPath = edgeRawConfig?.edgeTitleAttribute?.rawPath;
      !isStringNullorEmpty(edgeRawConfig?.edgeTitleAttribute?.key)? this.nwConfig.edge.edgeTitleAttribute.key = edgeRawConfig?.edgeTitleAttribute?.key : null;
      !isStringNullorEmpty(edgeRawConfig?.edgeTitleAttribute?.displayName)? this.nwConfig.edge.edgeTitleAttribute.displayName = edgeRawConfig?.edgeTitleAttribute?.displayName : null;
      typeof edgeRawConfig?.edgeTitleAttribute?.tooltip === 'boolean'? this.nwConfig.edge.edgeTitleAttribute.tooltip = edgeRawConfig?.edgeTitleAttribute?.tooltip : null;
    } else {
      console.error("Invalid rawPath in edgeTitleAttribute");
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
}
