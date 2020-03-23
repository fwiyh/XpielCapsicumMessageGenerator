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