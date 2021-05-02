
export class D3NetworkPosition implements INWPositionable{
  constructor(private viewportWidth: number, private viewportHeight, private nodeRadius) {

  }

  public async getNetworkPosition(nwData: INwData, timeInterval: number): Promise<INwData> {
    return new Promise((resolve) => {
      const linkDistance = 150;
      let nodes = Array.from(nwData.nodes.values());
      let links = Array.from(nwData.edges.values());

      let simulation = forceSimulation(nodes)
                        .force('charge', forceManyBody().distanceMax(this.viewportHeight/2).strength(-2000))
                        .force('collide', forceCollide().radius(this.nodeRadius).iterations(10))
                        .force('link', forceLink(links).distance(linksDistance).id((d: any) => d.id))
                        .force('x', forceX(this.viewportWidth/2))
                        .force('y', forceY(this.viewportHeight/2))
                        .stop();
      simulation.tick(500);

      resolve(nwData);
    });
  }
}
