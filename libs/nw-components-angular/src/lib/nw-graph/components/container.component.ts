import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import * as core from '@gfct/nw-core/src';
import * as core from '../../../../../nw-core/src';

@Component({
  selector: 'gfct-nw-ui',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  viewPortheight = core.theme.size.height;
  @ViewChild('graphcontainer') graphContainer: ElementRef | undefined;

  ngOnInit(): void {
    console.log("checking height", core.theme.size.height);
  }
}
