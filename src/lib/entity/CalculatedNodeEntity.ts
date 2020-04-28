export class CalculatedNode {
	nodeId!: string;				// 起点ノード
	// edge info
	distIds!: string[];				// 移動先ノード
	// dijkstra
	done: boolean = false;			// マーク済み
	minRoute: string[] = [];		// 最短経路
	minCost: number = Infinity;		// 最短のコスト

	constructor(nodeId: string, distIds: string[]){
		this.nodeId = nodeId;
		this.distIds = distIds.sort();
	}
}