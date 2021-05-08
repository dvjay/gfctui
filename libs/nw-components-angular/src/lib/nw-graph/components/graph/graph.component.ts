import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as core from '@gfct/nw-core/src';

@Component({
  selector: 'gfct-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit {
  viewPortheight = core.theme.size.height;
  @Input() containerOfGraph: HTMLElement | undefined;
  graphWidth: number = 0;

  ngOnInit(): void {
    console.log("checking height", core.theme.size.height);
  }

  ngAfterViewInit() {
    const graphWidth = this.containerOfGraph?.offsetWidth;
  }
}
