import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
// import * as core from '@gfct/nw-core/src';
import * as core from '../../../../../../nw-core/src';

@Component({
  selector: 'gfct-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit {
  viewPortheight = core.theme.size.height;
  viewPortWidth: number | undefined = 100;
  @Input() containerOfGraph: HTMLElement | undefined;

  ngOnInit(): void {
    console.log("checking height", core.theme.size.height);
  }

  ngAfterViewInit() {
    this.viewPortWidth = this.containerOfGraph?.offsetWidth;
  }
}
