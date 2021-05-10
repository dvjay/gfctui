import { INwData } from './nw-data';

export interface INWPositionable {
    getNetworkPosition(nwData: INwData, timeInterval: number): Promise<INwData>;
}