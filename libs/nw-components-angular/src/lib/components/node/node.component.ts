import { Component, Input, EventEmitter, ElementRef, Output, AfterViewInit, OnDestroy, SimpleChanges, ViewChild } from '@angular/core'; 
import { INode, NeighboursStateType } from '../../models/nw-data'; 
import { GraphEngineService } from '../../services/graph-engine. service'; 
import { NotificationBrokerService, NotificationMessage } from '../../services/notification-broker.service'; 
import { DispatchNodeLoadService } from '../../services/dispatch-node-load.service'; 
import { Subscription} from 'rxjs'; 
import { fromEvent } from 'rxjs/observable/fromEvent'; 
import { merge } from 'rxjs/observable/merge'; 
import { debounceTime } from 'rxjs/operators'; 
import { NodeRelationService, CurrentMouseOverNodeOrEdge } from '../../services/node-relation service';

@Component({
        selector: '[node]', 
        templateUrl: './node.component.html', 
        styleUrls: ['./node.component.css']
})
export class NodeComponent implements AfterViewInit, OnDestroy {
    @Input('node') node: INode; 
    @Input('graph') graph: GraphEngineService; 
    @Input('hideLabel') hideLabel: boolean; 
    @Input('nodes') nodes: INode[]; 
    @Input('rootNodeId') rootNodeId: string; 
    @Input('selectedNodes') selectedNodes: INode[]; 
    @Input('isMouseOverSidebar SelectedNodes') isMouseOverSidebarSelectedNodes: boolean; 
    @Input('highlightNodesFromSidebar') highlightNodesFromSidebar: string[];
    @Output() expandNode = new EventEmitter(); 
    @Output() mouseoverNodesFromSidebar = new EventEmitter(); 
    @Output() mouseoutNodesFromSidebar = new EventEmitter(); 
    @Output() selectNode = new EventEmitter(); 
    @Output() selectOnlyClickedNode = new EventEmitter(); 
    notificationMoveOverSub: Subscription; 
    notificationMoveOutSub: Subscription; 
    dispatchNodeLoad: Subscription; 
    nodeRelationMouseOverSub: Subscription; 
    nodeRelationMouseOutSub: Subscription; 
    nodeStyle: any = { stroke: 'gray' }; 
    isUnexpandable: boolean = false; 
    blurThisNode: boolean = false; 
    @ViewChild('nodeRef') el: ElementRef;

    constructor (private notificationBrokerService: NotificationBrokerService, 
                private dispatchNodeLoadService: DispatchNodeLoadService, 
                private nodeRelationService: NodeRelationService) {
        this.notificationMoveOverSub = notificationBrokerService.notificationMoveOver$.subscribe(
            (msgObj: NotificationMessage) => {
                if(this.node.nodeType === 'entity' && typeof msgObj.entityId === 'string' && msgObj.entityId === this.node['entityId'] ) {
                        this.highlightFromSidebar();
                    } else if(Array.isArray(msgObj.nodeIds) && msgObj.nodeIds.indexOf(this.node.nodeId) > -1) {
                        this.highlightFromSidebar();
                    }
                });
        this.notificationMoveOutSub = notificationBrokerService.notificationMoveOut$.subscribe(
            (msgObj: NotificationMessage) => {
                if(this.node.nodeType === 'entity' && typeof msgObj.entityId === 'string' && msgObj.entityId === this.node['entityId']) {
                    this.resetHighlightFromSidebar();
                } else if(Array.isArray(msgObj.nodeIds) && msgObj.nodeIds.indexOf(this.node.nodeId) > -1) {
                    this.resetHighlightFromSidebar();
                }
        });
        this.dispatchNodeLoad = dispatchNodeLoadService.dispatchNodeLoad$.subscribe(
            (nodeIds: string[]) => {
                if(Array.isArray(nodeIds) && nodeIds.indexOf(this.node.nodeId) > -1) {
                    this.nodeStyle = { stroke: '#ff4d4d', strokeDasharray: 2 };
                }
        });
        this.nodeRelationMouseOverSub = nodeRelationService.notificationMoveOver$.subscribe(
            (message: CurrentMouseOverNodeOrEdge) => {
                if(message.node) { 
                    if(message.node === this.node) {
                        this.blurThisNode = false;
                    } else {
                        if((Array.isArray(message.node.sourceIds) && message.node.sourceIds.indexOf(this.node.nodeId) > -1) || (Array.isArray(message.node.targetIds) && message.node.targetIds.indexOf(this.node.nodeId) > -1)) {
                            this.blurThisNode = false;
                        } else {
                            this.blurThisNode = true;
                        }
                    }
                } else if(message.edge) {
                    if(message.node === this.node) {

                    } else {

                    }
                } else {

                }
        
            });
        this.nodeRelationMouseOutSub = nodeRelationService.notificationMoveOut$.subscribe(
            (message: CurrentMouseOverNodeOrEdge) => {
                if(message.node) {
                    this.blurThisNode = false;
                } else if(message.edge) {

                } else {

                }
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) { 
        if (typeof changes['nodes'] !== "undefined" && typeof changes['nodes'].currentValue !== "undefined") {
            switch(this.node.neighboursStatus) {
                case NeighboursStateType.NOT_LOADED:
                    this.nodeStyle = { stroke: 'gray' };
                    break; 
                case NeighboursStateType.LOADING: 
                case NeighboursStateType.LOADING_THEN_EXPAND:
                    this.nodeStyle = { stroke: '#ff4d4d', strokeDasharray: 2 };
                    break; 
                case NeighboursStateType.LOADING_FAILED:
                    this.nodeStyle = { stroke: '#eb0000' }; 
                    break; 
                case NeighboursStateType.LOADED: 
                    if(this.node.collapsed) { 
                        if(this.allNeighboursVisible()) {
                            this.nodeStyle = { stroke: 'black' };
                        } else {
                            this.nodeStyle = { stroke: 'blue' };
                        }
                    } else {
                        this.nodeStyle = { stroke: 'black' };
                    }
                    break; 
                default:
                    this.nodeStyle = { stroke: 'gray' }; 
                    break;
                }
            }
        }
    
    ngAfterViewInit() {
        this.handleClickAndDoubleClick();
    }

    ngOnDestroy() {
        this.notificationMoveOverSub.unsubscribe(); 
        this.notificationMoveOutSub.unsubscribe(); 
        this.nodeRelationMouseOverSub.unsubscribe(); 
        this.nodeRelationMouseOutSub.unsubscribe();
    }

    get nodeOpacity() {
        if(this.isMouseOverSidebarSelectedNodes) {
            if(this.highlightNodesFromSidebar.indexOf(this.node.nodeId) > -1) {
                return 1;
            } else {
                return 0.2;
            }
        }
        if(this.blurThisNode) {
            return 0.2;
        }
        return 1;
    }

    get isDNDB() {
        return this.node && Array.isArray(this.node.src) && this.node.src.indexOf('DNDB') > -1 ? true: false;
    }

    handleClickAndDoubleClick() {
        const el = this.el.nativeElement; 
        const clickEvent = fromEvent<MouseEvent>(el, 'click'); 
        const dblClickEvent = fromEvent<MouseEvent>(el, 'dblclick'); 
        const eventsMerged = merge(clickEvent, dblClickEvent).pipe(debounceTime (300)); 
        eventsMerged.subscribe(
            (event) => {
                if(event.type === 'click') { 
                    if(this.selectNode) { 
                        if(event.ctrlkey) {
                            this.selectNode.emit(this.node.nodeId);
                        } else {
                            this.selectOnlyClickedNode.emit(this.node.nodeId);
                        }
                    }
                }
                if(event.type === 'dblclick') {
                    console.log("mouse double clicked"); 
                    switch (this.node.neighboursStatus) {
                        case NeighboursStateType.NOT_LOADED: 
                        case NeighboursStateType.LOADING_FAILED:
                            this.nodeStyle = { stroke: '#ff4d4d', strokeDasharray: 2 };
                            break; 
                        case NeighboursStateType.LOADED: 
                            if(this.node.collapsed) {
                                this.nodeStyle = { stroke: '#ff4d4d', strokeDasharray: 2 }; 
                                this.expandNode.emit(this.node);
                            }
                                break; 
                        default:
                            break;
                    }
                }     
            }
        );
    }
    handleMouseOver() {
        this.nodeRelationService.notificationMouseover({ node: this.node });
    }
    
    handleMouseOut() {
        this.nodeRelationService.notificationMouseOut({ node: this.node });
    }

    highlightFromSidebar() {
        if(this.mouseoutNodesFromSidebar) {
            this.mouseoutNodesFromSidebar.emit(this.node);
        }
    }

    resetHighlightFromSidebar() {
        if(this.mouseoutNodesFromSidebar) {
            this.mouseoutNodesFromSidebar.emit(this.node);
        }
    }

    allNeighboursVisible(): boolean {
        const visibleNodeIds = this.nodes.map(x => x.nodeId);
        return [...this.node.sourceIds, ...this.node.targetIds].every(n => visibleNodeIds.includes(n))
    }
        
}
