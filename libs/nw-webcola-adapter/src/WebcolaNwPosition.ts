
export class WebcolaNetworkPosition implements INWPositionable{
  private width: number;
  private height: number;
  private nodeRadius: number;
  private d3cola: any;

  constructor(private viewportWidth: number, private viewportHeight, private nodeRadius) {
    this.width = viewportWidth;
    this.height = viewportHeight;
    this.nodeRadius = nodeRadius;
    this.d3cola = cola.d3adapter(d3)
                    .size([viewportWidth, viewportHeight])
                    .avoidOverlaps(true)
                    .defaultNodeSize(60)
                    .symmetricDiffLinkLengths(100, 0.7);
  }

  public async getNetworkPosition(nwData: INwData, timeInterval: number): Promise<INwData> {
    return new Promise((resolve) => {
      let nodeKeys = [];
      let nodes = [];
      let links = [];
      let linkDistance = 150;
      let groupMap = {};
      let nodeIdx = 0;
      let groups = [];

      nwData.nodes.forEach((value: Node, key: string) => {
        var g = value.group;
        if(typeof groupMap[g] == 'undefined') {
          groupMap[g] = [];
        }
        groupMap[g].push(nodeIdx);

        nodeKeys.push(key);
        nodes.push({name: value.nodeId, group: value.group, x: value.x, y: value.y});
        ++nodeIdx;
      });

      nwData.edges.forEach((value: link) => {
        let sourceIdx = nodeKeys.indexOf(value.sourceNodeId);
        let targetIdx = nodeKeys.indexOf(value.targetNodeId);
        links.push({source: sourceIdx, target: targetIdx});
      });

      for(let g in groupMap) {
        groups.push({id: g, leaves: groupMap[g]})
      }

      if(nodes.length > 100) {
        linkDistance = 250;
      }

      if(nodes.length > 200) {
        linkDistance = 400;
      }

      this.d3cola
            .linkDistance(linkDistance)
            .nodes(nodes)
            .links(links)
            // .groups(groups)
            // .jaccardLinkLengths(linkDistance, 0.5)
            // .flowLayout('x', 100)
            .avoidOverlaps(true)
            .start(50, 15, 20);

      this.d3cola.stop();
      nodes.forEach((value: any) => {
        let _oldValue = data.nodes.get(value.name);
        _oldValue.x = value.x;
        _oldValue.y = value.y;
      });
      resolve();
    });
  }
}
