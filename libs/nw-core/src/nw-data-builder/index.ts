import {get as lodashGet} from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { EdgeId, IEdge, INode, INwData, NodeId, NodeNeighbourStatus } from '../models/nw-data';
import { NwConfigParser } from '../nw-config-parser';
import { EMPTY_STRING } from '../utils';

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
    if (
      this.nwConfigParser &&
      Array.isArray(this.nwConfigParser.nwNodeTypeRawPath)
    ) {
      const eAttrs = this.nwConfigParser.nwConfig.edge?.edgeAttributes;

      if(Array.isArray(eAttrs)) {
        for (const eAttr of eAttrs) {
          nwEdge[eAttr.key] = lodashGet(rawEdge, eAttr.rawPath, null);
        }
      }
    }
  }

  private loadNwNodeAttributesFromRawNode(rawNode: unknown, nwNode: INode) {
    if (
      this.nwConfigParser &&
      Array.isArray(this.nwConfigParser.nwNodeTypeRawPath)
    ) {
      // Step 1: Get Node Type
      const nodeType = lodashGet(
        rawNode,
        this.nwConfigParser.nwNodeTypeRawPath,
        null
      );
      // Step 2: Get Node Type Config
      const nodeTypeConfig = this.nwConfigParser.nwNodeTypes.get(nodeType);
      if (nodeTypeConfig) {
        // Step 3: Get Node Type attributes
        const nAttrs = Array.isArray(nodeTypeConfig.nodeAttributes)
          ? nodeTypeConfig.nodeAttributes
          : [];
        for (const nAttr of nAttrs) {
          nwNode[nAttr.key] = lodashGet(rawNode, nAttr.rawPath, null);
        }
      }
    }
  }

  private sanitizeNwNode(nwNode: INode) {
    if(this.nwConfigParser?.nwConfig?.node) {
      const nId = nwNode[this.nwConfigParser.nwConfig.node.nodeIdAttributeKey];
      const nType =
        nwNode[this.nwConfigParser.nwConfig.node.nodeTypeAttributeKey];
      const nTitle =
        nwNode[this.nwConfigParser.nwConfig.node.nodeTitleAttributeKey];
      if (nwNode) {
        nwNode.id =
          typeof nId === 'string' || typeof nId === 'number'
            ? nId.toString()
            : EMPTY_STRING;
        nwNode.type =
          typeof nType === 'string' || typeof nType === 'number'
            ? nType.toString()
            : EMPTY_STRING;
        nwNode.r = this.nwConfigParser.nwConfig.nodeRadius;
        nwNode.sourceIds = [];
        nwNode.targetIds = [];
        nwNode.neighbourStatus = NodeNeighbourStatus.NOT_LOADED;
      }
    }
  }
  
  private sanitizeNwEdge(nwEdge: IEdge) {
    if(this.nwConfigParser?.nwConfig?.edge) {
      const edgeId = nwEdge.id;
      const sourceKeyId = nwEdge[this.nwConfigParser.nwConfig.edge.edgeSourceIdAttributeKey];
      const targetKeyId = nwEdge[this.nwConfigParser.nwConfig.edge.edgeTargetIdAttributeKey];
      const edgeTitle = nwEdge[this.nwConfigParser.nwConfig.edge.edgeTitleAttributeKey];
      if (nwEdge) {
        nwEdge.source =
          typeof sourceKeyId === 'string' || typeof sourceKeyId === 'number'
            ? sourceKeyId.toString()
            : EMPTY_STRING;
        nwEdge.target =
          typeof targetKeyId === 'string' || typeof targetKeyId === 'number'
            ? targetKeyId.toString()
            : EMPTY_STRING;
        nwEdge.title =
          typeof edgeTitle === 'string' || typeof edgeTitle === 'number'
            ? edgeTitle.toString()
            : EMPTY_STRING;
        nwEdge.id =
          typeof edgeId === 'string' || typeof edgeId === 'number'
            ? edgeTitle.toString()
            : uuidv4();
      }
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
      if (typeof nwEdge.source === 'string' && nwEdge.source.trim().length > 0) {
        sourceValid = true;
      }
      // Validating Target Node Type
      if (typeof nwEdge.target === 'string' && nwEdge.target.trim().length > 0) {
        targetValid = true;
      }
      return sourceValid && targetValid;
    } else {
      return false;
    }
  }
}
