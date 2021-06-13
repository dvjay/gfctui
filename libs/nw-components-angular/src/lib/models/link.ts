export default class IEdge {
    index?: number;
    sourceNodeId: string;
    targetNodeId: string;
    constructor(public linkId,
                public source: string | Partial<{ x: number, y: number }>,
                public target: string | Partial<{ x: number, y: number }>,
                public name: string) {
                    this.sourceNodeId = typeof source === string? source: '';
                    this.targetNodeId = typeof target === string? target: '';
                }
}
}