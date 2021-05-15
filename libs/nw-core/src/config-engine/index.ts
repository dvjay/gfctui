import { defaultNwEdgeConfig, defaultNwNodeConfig, NwAlert, NwAttribute, NwEdge, NwNodeType } from './../models/nw-config';
import { defaultNwConfig, NwConfig, NwNode } from "../models/nw-config";
import { INwData } from "../models/nw-data";
import { toNumber } from "../utils";

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
      this.setNodeAttributesConfig();
      this.setNodeAlertsConfig();
      this.setEdgeAttributesConfig();

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
    if(typeof nodeRawConfig.parentKey === 'string') {
      this.nwConfig.node.parentKey = nodeRawConfig.parentKey;
    }
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
      this.nwConfig.node.nodeTypes.push({
        key: typeof nodeTypeFromConfig.key === 'string'? nodeTypeFromConfig.key : "",
        displayName: typeof nodeTypeFromConfig.displayName === 'string'? nodeTypeFromConfig.displayName : "",
        color: typeof nodeTypeFromConfig.color === 'string'? nodeTypeFromConfig.color : "",
        imagePath: typeof nodeTypeFromConfig.imagePath === 'string'? nodeTypeFromConfig.imagePath : ""
      });
    }
  }

  setNodeAttributesConfig() {
    let nodeAttributesRawConfig = (this.nwRawConfig && this.nwRawConfig.node && Array.isArray((this.nwRawConfig.node as NwNode).nodeAttributes)? 
                              (this.nwRawConfig.node as NwNode).nodeAttributes: []) as NwAttribute[];
    for (const nodeAttributeFromConfig of nodeAttributesRawConfig) {
      this.nwConfig.node.nodeAttributes.push({
        key: typeof nodeAttributeFromConfig.key === 'string'? nodeAttributeFromConfig.key : "",
        displayName: typeof nodeAttributeFromConfig.displayName === 'string'? nodeAttributeFromConfig.displayName : "",
        rawPath: typeof nodeAttributeFromConfig.rawPath === 'string'? nodeAttributeFromConfig.rawPath : [],
        tooltip: typeof nodeAttributeFromConfig.tooltip === 'string'? nodeAttributeFromConfig.tooltip : false
      });
    }
  }

  setNodeAlertsConfig() {
    let nodeAlertsRawConfig = (this.nwRawConfig && this.nwRawConfig.node && Array.isArray((this.nwRawConfig.node as NwNode).alerts)? 
                              (this.nwRawConfig.node as NwNode).alerts: []) as NwAlert[];
    for (const nodeAlertFromConfig of nodeAlertsRawConfig) {
      if(typeof nodeAlertFromConfig.nodeAttributeKey === 'string' && this.nwConfig.node.nodeAttributes.find((x) => x.key === nodeAlertFromConfig.nodeAttributeKey))
      this.nwConfig.node.alerts.push({
        id: typeof nodeAlertFromConfig.id === 'string'? nodeAlertFromConfig.id : "",
        nodeAttributeKey: typeof nodeAlertFromConfig.nodeAttributeKey === 'string'? nodeAlertFromConfig.nodeAttributeKey : "",
        valueType: typeof nodeAlertFromConfig.valueType === 'string'? nodeAlertFromConfig.valueType : "",
        value: typeof nodeAlertFromConfig.value === 'string'? nodeAlertFromConfig.value : "",
        alertMessage: typeof nodeAlertFromConfig.alertMessage === 'string'? nodeAlertFromConfig.alertMessage : ""
      });
    }
  }

  setEdgeConfig() {
    let edgeRawConfig = (this.nwRawConfig && this.nwRawConfig.edge? this.nwRawConfig.edge: {}) as NwEdge;
    if(typeof edgeRawConfig.parentKey === 'string') {
      this.nwConfig.edge.parentKey = edgeRawConfig.parentKey;
    }
    if(Array.isArray(edgeRawConfig.parentRawPath)) {
      this.nwConfig.edge.parentRawPath = edgeRawConfig.parentRawPath;
    }
    if(typeof edgeRawConfig.edgeIdAttributeKey === 'string') {
      this.nwConfig.edge.edgeIdAttributeKey = edgeRawConfig.edgeIdAttributeKey;
    }
  }

  setEdgeAttributesConfig() {
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

  private getDefaultConfig(): NwConfig {
    return {...defaultNwConfig, node: {...defaultNwNodeConfig}, edge: {...defaultNwEdgeConfig}};
  }
}
