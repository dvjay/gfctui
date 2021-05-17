import { Component, OnInit } from '@angular/core';
import * as config from '../nwconfig.json';
import * as data from '../sampleData.json';
import {NwConfigParser, NwDataBuilder} from '../../../../libs/nw-core/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'nw-lib-demo';
  nwConfig: any = [];

  ngOnInit(): void {
    this.nwConfig = (config as any).default as unknown;
    const nwConfigParser = new NwConfigParser(this.nwConfig);
    console.log("checking nwConfigParser", nwConfigParser);
    const nwData = new NwDataBuilder(nwConfigParser);
    const networkData = nwData.getNetworkData(data);
    console.log("checking nwData", networkData);
  }
}
