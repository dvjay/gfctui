import { defaultNwEdgeConfig, defaultNwNodeConfig, NwAttribute, NwEdge, NwNodeType } from './../models/nw-config';
import { defaultNwConfig, NwConfig, NwNode } from "../models/nw-config";
import { EdgeId, IEdge, INode, INwData, NodeId } from "../models/nw-data";
import { toNumber } from "../utils";
import _ from 'lodash';

interface NwRawConfig {
  [key: string]: unknown;
}

export default class ConfigEngine {
  private nwRawConfig: NwRawConfig;
  public nwData: INwData;
  public nwConfig: NwConfig;

  constructor(config: NwRawConfig) {
    if(typeof config === 'object') {
      this.nwRawConfig = config;
      this.nwConfig = this.getDefaultConfig();
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
      if(rawConfig && typeof rawConfig.maxSelectedNodes === 'number') {
        this.nwConfig.maxSelectedNodes = toNumber(rawConfig.maxSelectedNodes);
      }
      if(rawConfig && typeof rawConfig.displayLabel === 'boolean') {
        this.nwConfig.displayLabel = rawConfig.displayLabel;
      }
      if(rawConfig && typeof rawConfig.autoExpand === 'boolean') {
        this.nwConfig.autoExpand = rawConfig.autoExpand;
      }
      if(rawConfig && typeof rawConfig.numHops === 'number') {
        this.nwConfig.numHops = toNumber(rawConfig.numHops);
      }
      if(rawConfig && typeof rawConfig.maxNodeCount === 'number') {
        this.nwConfig.maxNodeCount = toNumber(rawConfig.maxNodeCount);
      }
      if(rawConfig && typeof rawConfig.viewportHeight === 'number') {
        this.nwConfig.viewportHeight = toNumber(rawConfig.viewportHeight);
      }
    }
  }

  private setNodeConfig() {
    let nodeRawConfig = (this.nwRawConfig && this.nwRawConfig.node? this.nwRawConfig.node: {}) as NwNode;
    if(Array.isArray(nodeRawConfig.parentRawPath)) {
      this.nwConfig.node.parentRawPath = nodeRawConfig.parentRawPath;
    }
    if(typeof nodeRawConfig.nodeIdAttributeKey === 'string') {
      this.nwConfig.node.nodeIdAttributeKey = nodeRawConfig.nodeIdAttributeKey;
    }
    if(typeof nodeRawConfig.nodeTypeAttributeKey === 'string') {
      this.nwConfig.node.nodeTypeAttributeKey = nodeRawConfig.nodeTypeAttributeKey;
    }
  }

  private setNodeTypesConfig() {
    let nodeTypesRawConfig = (this.nwRawConfig && this.nwRawConfig.node && Array.isArray((this.nwRawConfig.node as NwNode).nodeTypes)? 
                              (this.nwRawConfig.node as NwNode).nodeTypes: []) as NwNodeType[];
    for (const nodeTypeFromConfig of nodeTypesRawConfig) {
      let nodeAttributes = [];
      let nodeAttributesRawConfig = Array.isArray(nodeTypeFromConfig.nodeAttributes)? nodeTypeFromConfig.nodeAttributes: [];
      for (const nAttr of nodeAttributesRawConfig) {
        nodeAttributes.push({
          key: typeof nAttr.key === 'string'? nAttr.key: "",
          displayName: typeof nAttr.displayName === 'string'? nAttr.displayName: "",
          rawPath: Array.isArray(nAttr.rawPath)? nAttr.rawPath: [],
          tooltip: typeof nAttr.tooltip === 'boolean'? nAttr.tooltip: false
        });
      }

      this.nwConfig.node.nodeTypes.push({
        key: typeof nodeTypeFromConfig.key === 'string'? nodeTypeFromConfig.key : "",
        displayName: typeof nodeTypeFromConfig.displayName === 'string'? nodeTypeFromConfig.displayName : "",
        color: typeof nodeTypeFromConfig.color === 'string'? nodeTypeFromConfig.color : "",
        imagePath: typeof nodeTypeFromConfig.imagePath === 'string'? nodeTypeFromConfig.imagePath : "",
        nodeAttributes: nodeAttributes
      });
    }
  }

  private setEdgeConfig() {
    let edgeRawConfig = (this.nwRawConfig && this.nwRawConfig.edge? this.nwRawConfig.edge: {}) as NwEdge;
    if(Array.isArray(edgeRawConfig.parentRawPath)) {
      this.nwConfig.edge.parentRawPath = edgeRawConfig.parentRawPath;
    }
    if(typeof edgeRawConfig.edgeIdAttributeKey === 'string') {
      this.nwConfig.edge.edgeIdAttributeKey = edgeRawConfig.edgeIdAttributeKey;
    }
  }

  private setEdgeAttributesConfig() {
    let edgeAttributesRawConfig = (this.nwRawConfig && this.nwRawConfig.edge && Array.isArray((this.nwRawConfig.edge as NwEdge).edgeAttributes)? 
                              (this.nwRawConfig.edge as NwEdge).edgeAttributes: []) as NwAttribute[];
    for (const edgeAttributeFromConfig of edgeAttributesRawConfig) {
      this.nwConfig.edge.edgeAttributes.push({
        key: typeof edgeAttributeFromConfig.key === 'string'? edgeAttributeFromConfig.key : "",
        displayName: typeof edgeAttributeFromConfig.displayName === 'string'? edgeAttributeFromConfig.displayName : "",
        rawPath: Array.isArray(edgeAttributeFromConfig.rawPath)? edgeAttributeFromConfig.rawPath : [],
        tooltip: typeof edgeAttributeFromConfig.tooltip === 'string'? edgeAttributeFromConfig.tooltip : false
      });
    }
  }

  public getNetworkData(rawData: unknown) {
    const nwData = {
      nodes: new Map<NodeId, INode>(),
      edges: new Map<EdgeId, IEdge>()
    } as INwData;

    const nodeCollection = _.get(rawData, this.nwConfig.node.parentRawPath);
    const edgeCollection = _.get(rawData, this.nwConfig.edge.parentRawPath);
    if(Array.isArray(nodeCollection)) {

    }
    if(nwData.nodes.size > 0 && Array.isArray(edgeCollection)) {

    }
    return nwData;
  }

  private getDefaultConfig(): NwConfig {
    return {...defaultNwConfig, node: {...defaultNwNodeConfig}, edge: {...defaultNwEdgeConfig}};
  }
}
