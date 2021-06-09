import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

// import * as core from '@gfct/nw-core/src';
import * as core from '../../../../../nw-core/src';

@Component({
  selector: 'gfct-nw-ui',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit, AfterViewInit {
  @Input('data') data: any | undefined;
  @Input('config') config: any | undefined;
  @Output('maxNodesChanged') maxNodesChanged = new EventEmitter();
  @Output('numHopsChanged') numHopsChanged = new EventEmitter();
  @Output('displayedDataChanged') displayedDataChanged = new EventEmitter();
  viewPortheight = core.theme.size.height;

  ngOnInit(): void {
    console.log("checking height", core.theme.size.height);
  }

  ngAfterViewInit() {

  }
}
