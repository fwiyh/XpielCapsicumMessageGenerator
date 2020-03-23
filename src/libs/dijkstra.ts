import * as data from "../data/positions.json";
import { DNode } from "../entity/DNodeEntity";
import { DEdge } from "../entity/DEdgeEntity";
import { CalculatedNode } from "../entity/CalculatedNodeEntity";
import lodash from "lodash";

export class Dijkstra {
	// route informations
	private nodes!: DNode[];	// node list
	private edges!: DEdge[];	// edge list
	private calculatedNode: CalculatedNode[] = [];

	constructor() {
		this.nodes = data.nodes;
		this.edges = data.edges.map((v) => new DEdge(v.route, v.cost));
		for (var i = 0; i < this.nodes.length; i++){
			const d: DEdge[] = this.getNextNodes(this.nodes[i].id);
			const routes = d.map(v => v.route[0]);
			this.calculatedNode.push(new CalculatedNode(this.nodes[i].id, routes));
		}
	}
	// return DEdge[]
	private getNextNodes(startId: string){
		return this.edges
			.filter(v => v.route.indexOf(startId) > -1)
			.map(v => {
				return new DEdge(v.route.filter(x => x != startId), v.cost);
			});
	}

	/**
	 * 起点と複数のターゲットノードから最短を取得
	 * @param startNodeId 
	 * @param targetNodes 
	 */
	calcEachNodes(startNodeId: string, targetNodes: string[]){
		let minNode: CalculatedNode = new CalculatedNode("", []);
		targetNodes.forEach(
			n => {
				const calc: CalculatedNode = <CalculatedNode>this.findNode(startNodeId, n);
				if (minNode.minCost > calc.minCost){
					minNode = calc;
				}
			}
		);
		return minNode;
	}

	/**
	 * 隣接n件のノードを返す
	 * @param startNodeId 
	 * @param targetNodes 
	 * @param resultRows 
	 */
	calcTop_N_Nodes(startNodeId: string, targetNodes: string[], resultRows: number){
		if (resultRows < 0){
			return [];
		}
		let nodes = targetNodes.map(
			n => {
				return <CalculatedNode>this.findNode(startNodeId, n);
			}
		);
		return nodes.sort((a,b) => { return a.minCost - b.minCost }).slice(0,resultRows);
	}

	/**
	 * 2ノード間の経路とコストを計算する
	 * @param startId 
	 * @param goalId 
	 */
	findNode(startId: string, goalId: string) {
		console.debug("begin findNode :" + startId + " to " + goalId);
		const startValid = this.nodes.filter((n) => (n.id == startId));
		const endValid = this.nodes.filter((n) => (n.id == goalId));
		if (startValid.length < 1 && endValid.length < 1) {
			return new CalculatedNode("", []);
		}
		// オブジェクトの値渡し
		let nodes: CalculatedNode[] = lodash.cloneDeep(this.calculatedNode);
		console.debug(nodes);

		this.calc(nodes, startId);
		const minRouteNode = nodes.find(
							n => {
								let first = n.minRoute[0];
								let last = n.minRoute[n.minRoute.length -1];
								return (startId == first && goalId == last);
							}
						) ?? new CalculatedNode("", []);
		console.debug("Result Minimum Route is " + minRouteNode?.minRoute.toString());
		console.debug("Result Minimum cost is " + minRouteNode?.minCost);
		return minRouteNode;
	}

	/**
	 * 経路検索のロジック
	 * http://nw.tsuda.ac.jp/lec/dijkstra/
	 * 1. 各ノードのコストをinfinityにする
	 * 2. 未確定経路の中から次のノードへのコストが最も小さい経路を洗濯
	 * 3. ノードが過去のコストより小さい場合はコストを更新
	 */
	private calc(nodes: CalculatedNode[], startId: string){
		// 起点ノード
		let targetNodeIndex = nodes.findIndex(n => n.nodeId == startId);
		// 起点を0にする
		nodes[targetNodeIndex].done = true;
		nodes[targetNodeIndex].minRoute = [startId];
		nodes[targetNodeIndex].minCost = 0;
		while (true){
			// 隣接経路を選択
			this.updateNextNodesCost(nodes, targetNodeIndex);
			// 確定済みからコスト最小を取得
			targetNodeIndex = this.getMinimumCostIndex(nodes);
			if (targetNodeIndex == -1){
				console.debug("complete");
				return;
			}
		}
	}

	// 隣接＆未確定ノードのコストを計算する
	private updateNextNodesCost(nodes: CalculatedNode[], markedIndex: number){
		// マーク
		nodes[markedIndex].done = true;
		// 起点のノードID・コスト・最短経路
		let markedNodeId = nodes[markedIndex].nodeId;
		let markedRoute = nodes[markedIndex].minRoute;
		let markedCost = nodes[markedIndex].minCost;
		// 隣接ノードID・コスト
		let nextNodeIds = nodes[markedIndex].distIds;

		console.debug("calculate node:" + markedNodeId);
		// ノード全体から隣接ノードのみ処理を行う
		nodes
			.filter(n => 
				(
					// 起点以外の隣接ノード
					nextNodeIds.indexOf(n.nodeId) > -1 
					&& n.nodeId != markedNodeId)
					// 既存ノードよりコストが小さいもの
					&& n.minCost > markedCost + this.getCost(n.nodeId, markedNodeId
				)
			)
			.forEach(
				n => {
					// 別経路よりコストが小さい場合はコスト・経路の更新
					n.minRoute = markedRoute.concat([n.nodeId]);
					n.minCost = markedCost + this.getCost(n.nodeId, markedNodeId);
					console.debug("updated node: " + n.nodeId + ", cost: " + n.minCost + ", route: [" + n.minRoute.toString() + "]");
				}
			);
	}

	// 隣接＆未確定からコスト最小のノードindexを返す
	private getMinimumCostIndex(nodes: CalculatedNode[]){
		let decidedNodes = nodes.filter(n => (!n.done && n.minCost > 0 && n.minCost != Infinity));
		console.debug(decidedNodes);
		if (decidedNodes.length == 0){
			return -1;
		}
		// 最小コストを１件取得
		let minCosts: number[] = decidedNodes.map(n => n.minCost);
		let minCost: number = Math.min.apply(null, minCosts);
		let minCostIndex =  minCosts.findIndex(c => c == minCost);
		return nodes.findIndex(n => n.nodeId == decidedNodes[minCostIndex].nodeId);
	}

	// edge情報からコストを取得
	private getCost(nodeId1: string, nodeId2: string){
		return this.edges.find(d => JSON.stringify(d.route) == JSON.stringify([nodeId1, nodeId2].sort()))?.cost ?? Infinity;
	}
}
