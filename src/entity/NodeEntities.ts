// Entities at json data
// node information
export class DNode {
	// node id
	id!: string;
}
// edge information
export class DEdge {
	route: string[];	// two pairs node id
	cost: number;		// route cost
	// route
	constructor(route: string[], cost: number = 0){
		this.route = route.sort();
		this.cost = cost;
	}
}

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
