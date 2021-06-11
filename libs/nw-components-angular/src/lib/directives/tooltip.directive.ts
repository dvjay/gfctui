import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[tooltip]'
})
export class TooltipDirective implements OnInit {
    @Input('tooltip') tooltipNode: INode;
    @Input('nodesDescription') nodesDescription: any[];

    constructor(private d3Service: D3Service, private _element: ElementRef) {
        
    }

    ngOnInit() {
        this.d3Service.createTooltip(this._element.nativeElement, this.tooltipNode);
    }
}