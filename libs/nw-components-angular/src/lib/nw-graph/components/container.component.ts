import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import * as core from '@gfct/nw-core/src';
import * as core from '../../../../../nw-core/src';

@Component({
  selector: 'gfct-nw-ui',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit, AfterViewInit {
  viewPortheight = core.theme.size.height;

  ngOnInit(): void {
    console.log("checking height", core.theme.size.height);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.widthContainer = this.graphContainer?.nativeElement?.offsetWidth;
    //   console.log("graphContainer: ", this.widthContainer);
    // }, 0);
  }
}
