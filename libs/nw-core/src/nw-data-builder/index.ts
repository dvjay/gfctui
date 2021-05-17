import {get as lodashGet} from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { EdgeId, IEdge, INode, INwData, NodeId, NodeNeighbourStatus } from '../models/nw-data';
import { NwConfigParser } from '../nw-config-parser';
import { EMPTY_STRING, isArrayOfNonEmptyStrings, isStringNullorEmpty } from '../utils';

export class NwDataBuilder {
  public nwData: INwData = {
    nodes: new Map<NodeId, INode>(),
    edges: new Map<EdgeId, IEdge>(),
  };
  constructor(private nwConfigParser: NwConfigParser) {}

  public getNetworkData(rawData: unknown) {
    if (
      this.nwConfigParser &&
      this.nwConfigParser.nwConfig &&
      this.nwConfigParser.nwConfig.node &&
      this.nwConfigParser.nwConfig.edge
    ) {
      const nodeCollection = lodashGet(
        rawData,
        this.nwConfigParser.nwConfig.node.parentRawPath,
        null
      );
      const edgeCollection = lodashGet(
        rawData,
        this.nwConfigParser.nwConfig.edge.parentRawPath,
        null
      );
      // Node
      if (Array.isArray(nodeCollection)) {
        for (const rawNode of nodeCollection) {
          const newNode = {} as INode;
          this.loadNwNodeAttributesFromRawNode(rawNode, newNode);
          this.sanitizeNwNode(newNode);
          if (this.isNwNodeValid(newNode)) {
            this.nwData.nodes.set(newNode.id, newNode);
          }
        }
      }
      // Edge
      if (Array.isArray(edgeCollection)) {
        for (const rawEdge of edgeCollection) {
          const newEdge = {} as IEdge;
          this.loadNwEdgeAttributesFromRawNode(rawEdge, newEdge);
          this.sanitizeNwEdge(newEdge);
          if (this.isNwEdgeValid(newEdge)) {
            this.nwData.edges.set(newEdge.id, newEdge);
          }
        }
      }
    }
    return this.nwData;
  }

  private loadNwEdgeAttributesFromRawNode(rawEdge: unknown, nwEdge: IEdge) {
    const edgeSourceRawPath =
      this.nwConfigParser?.nwConfig?.edge?.edgeSourceIdAttribute?.rawPath;
    const edgeTargetRawPath =
      this.nwConfigParser?.nwConfig?.edge?.edgeTargetIdAttribute?.rawPath;
    const edgeTitleRawPath =
      this.nwConfigParser?.nwConfig?.edge?.edgeTitleAttribute?.rawPath;
    const eAttrs = this.nwConfigParser.nwConfig.edge?.edgeAttributes;
    if (Array.isArray(eAttrs)) {
      for (const eAttr of eAttrs) {
        if (eAttr?.key && !isStringNullorEmpty(eAttr.key)) {
          nwEdge[eAttr.key] = lodashGet(rawEdge, eAttr.rawPath as string[], null);
        }
      }
    }
    // Set Edge Source ID
    if(isArrayOfNonEmptyStrings(edgeSourceRawPath)) {
      nwEdge.source = lodashGet(rawEdge, edgeSourceRawPath as string[], EMPTY_STRING);
    }
    // Set Edge target Type
    if(isArrayOfNonEmptyStrings(edgeTargetRawPath)) {
      nwEdge.target = lodashGet(rawEdge, edgeTargetRawPath as string[], EMPTY_STRING);
    }
    // Set Edge Title
    if(isArrayOfNonEmptyStrings(edgeTitleRawPath)) {
      nwEdge.title = lodashGet(rawEdge, edgeTitleRawPath as string[], EMPTY_STRING);
    }
  }

  private loadNwNodeAttributesFromRawNode(rawNode: unknown, nwNode: INode) {
    const nodeIdRawPath =
      this.nwConfigParser?.nwConfig?.node?.nodeIdAttribute?.rawPath;
    const nodeTypeRawPath =
      this.nwConfigParser?.nwConfig?.node?.nodeTypeAttribute?.rawPath;
    const nodeTitleRawPath =
      this.nwConfigParser?.nwConfig?.node?.nodeTitleAttribute?.rawPath;
    // Step 1: Get Node Type
    const nodeType = lodashGet(rawNode, nodeTypeRawPath as string[], EMPTY_STRING);
    // Step 2: Get Node Type Config
    const nodeTypeConfig = this.nwConfigParser.nwNodeTypes.get(nodeType);
    // Step 3: Get NodeType attributes
    const nAttrs = nodeTypeConfig?.nodeAttributes;
    if (Array.isArray(nAttrs)) {
      for (const nAttr of nAttrs) {
        if (nAttr?.key && !isStringNullorEmpty(nAttr?.key) && isArrayOfNonEmptyStrings(nAttr?.rawPath)) {
          nwNode[nAttr.key] = lodashGet(rawNode, nAttr.rawPath as string[], EMPTY_STRING);
        }
      }
    }
    // Set Node ID
    if(isArrayOfNonEmptyStrings(nodeIdRawPath)) {
      nwNode.id = lodashGet(rawNode, nodeIdRawPath as string[], EMPTY_STRING);
    }
    // Set Node Type
    if(isArrayOfNonEmptyStrings(nodeTypeRawPath)) {
      nwNode.type = lodashGet(rawNode, nodeTypeRawPath as string[], EMPTY_STRING);
    }
    // Set Node Title
    if(isArrayOfNonEmptyStrings(nodeTitleRawPath)) {
      nwNode.title = lodashGet(rawNode, nodeTitleRawPath as string[], EMPTY_STRING);
    }
  }

  private sanitizeNwNode(nwNode: INode) {
    if (typeof nwNode === 'object') {
      nwNode.id =
        typeof nwNode?.id === 'string' || typeof nwNode?.id === 'number'
          ? nwNode.id.toString()
          : EMPTY_STRING;
      nwNode.type =
        typeof nwNode?.type === 'string' || typeof nwNode?.type === 'number'
          ? nwNode.type.toString()
          : EMPTY_STRING;
      nwNode.r = this.nwConfigParser.nwConfig.nodeRadius;
      nwNode.sourceIds = [];
      nwNode.targetIds = [];
      nwNode.neighbourStatus = NodeNeighbourStatus.NOT_LOADED;
    }
  }

  private sanitizeNwEdge(nwEdge: IEdge) {
    if (typeof nwEdge === 'object') {
      nwEdge.source =
      typeof nwEdge.source === 'string' || typeof nwEdge.source === 'number'
        ? nwEdge.source.toString()
        : EMPTY_STRING;
      nwEdge.target =
        typeof nwEdge.target === 'string' || typeof nwEdge.target === 'number'
          ? nwEdge.target.toString()
          : EMPTY_STRING;
      nwEdge.title =
        typeof nwEdge.title === 'string' || typeof nwEdge.title === 'number'
          ? nwEdge.title.toString()
          : EMPTY_STRING;
      nwEdge.id =
        typeof nwEdge.id === 'string' || typeof nwEdge.id === 'number'
          ? nwEdge.id.toString()
          : uuidv4();
    }
  }

  private isNwNodeValid(nwNode: INode) {
    let idValid = false;
    let typeValid = false;
    if (nwNode) {
      // Validating Node ID
      if (typeof nwNode.id === 'string' && nwNode.id.trim().length > 0) {
        idValid = true;
      }
      // Validating Node Type
      if (typeof nwNode.type === 'string' && nwNode.type.trim().length > 0) {
        typeValid = true;
      }
      return idValid && typeValid;
    } else {
      return false;
    }
  }

  private isNwEdgeValid(nwEdge: IEdge) {
    let sourceValid = false;
    let targetValid = false;
    if (nwEdge) {
      // Validating Source Node ID
      if (
        typeof nwEdge.source === 'string' &&
        nwEdge.source.trim().length > 0
      ) {
        sourceValid = true;
      }
      // Validating Target Node Type
      if (
        typeof nwEdge.target === 'string' &&
        nwEdge.target.trim().length > 0
      ) {
        targetValid = true;
      }
      return sourceValid && targetValid;
    } else {
      return false;
    }
  }
}
