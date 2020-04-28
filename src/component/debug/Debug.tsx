import React, { createContext, useContext, useState } from "react";

import { Context } from "../App";
import { NodeList } from "./NodeList";

import { Dijkstra } from "../../lib/dijkstra";

import { AvailableNodeInfo } from "../../types/debug/AvailableNodeInfo";

type DebugContextType = {
    debugRouteSearchFrom: string,
    debugRouteSearchTo: string,
    debugSearchMinimumCostNode: string,
    debugStartNNode: string,
}
const debugContext = {
    debugRouteSearchFrom: "" as string,
    debugRouteSearchTo: "" as string,
    debugSearchMinimumCostNode: "" as string,
    debugStartNNode: "" as string,
    availableNodeInfo: [] as AvailableNodeInfo[],

    setConfig(key: string, value: string){
        if (key in debugContext){
            const k = key as keyof DebugContextType;
            debugContext[k] = value;
        }
    },    
}
export const DebugContext = createContext(debugContext);

export const Debug = () => {
    // 自身のファイル名
    const uriFileName = location.href.split("/").pop();
    if (uriFileName != "debug.html"){
        return(<></>)
    }

    // 経路計算クラス
    const dijkstra = new Dijkstra();

    // 利用可能ノード一覧
    const { positions } = useContext(Context);
    const nodeList = [] as AvailableNodeInfo[];
    for (let i = 0; i < positions.regions.length; i++){
        const region = positions.regions[i];
        for (let j = 0; j < region.locations.length; j++){
            const location = region.locations[j];
            const node: AvailableNodeInfo = {
                nodeId: location.id,
                nodeName: location.name,
                regionName: region.name,
            };
            nodeList.push(node);
        }
    }
    debugContext.availableNodeInfo = nodeList;
    
    // state
    const [ debugRouteSearchResult, setDebugRouteSearchResult ] = useState(<></>);
    const [ numberOfNodes, setNumberOfNodes ] = useState("2");

    // findNode
    const debugRouteSearch = (start: string, goal: string) => {
        const minCostNode = dijkstra.findNode(start, goal);
        console.log("minRoute: " + minCostNode.minRoute.toString() + "\nminCost: " + minCostNode.minCost);
        return (
            <div>
                <div>{"minRoute: " + minCostNode.minRoute.toString()}</div>
                <div>{"minCost: " + minCostNode.minCost}</div>
            </div>
        )
    }
    // calcEachNodes
    const debugEachNodes = (debugSearchMinimumCostNode: string) => {
        const nodes = nodeList.map(n => n.nodeId).filter(n => n != debugSearchMinimumCostNode);
        const minCostNode = dijkstra.calcEachNodes(debugSearchMinimumCostNode, nodes);
        console.log("minRoute: " + minCostNode.minRoute.toString() + "\nminCost: " + minCostNode.minCost);
        return (
            <div>
                <div>{"minRoute: " + minCostNode.minRoute.toString()}</div>
                <div>{"minCost: " + minCostNode.minCost}</div>
            </div>
        )
    }
    // calcTop_N_Nodes
    const debugCalcTopNNodes = (start: string, n: string) => {
        const num = parseInt(n) ?? 2;
        const nodes = nodeList.map(n => n.nodeId).filter(n => n != start);
        const topNNodes = dijkstra.calcTop_N_Nodes(start, nodes, num);
        let result = "";
        let resultJsx = [];
        for (let i = 0; i < topNNodes.length; i++) {
            const node = topNNodes[i];
            result += i + "\nnodeId: " + node.nodeId + "\nminRoute: " + node.minRoute.toString() + "\nminCost: " + node.minCost + "\n";
            resultJsx.push(
                <div key={result}>
                    <div>{i}</div>
                    <div>{"nodeId: " + node.nodeId}</div>
                    <div>{"minRoute: " + node.minRoute.toString()}</div>
                    <div>{"minCost: " + node.minCost}</div>
                </div>
            );
        }
        console.log(result);
        return (
            <div>
                {resultJsx}
            </div>
        );
    }

    return (
        <>
        <div className="row">
            <div className="col-4">
                <NodeList stateName={"debugRouteSearchFrom"} defaultIndex={0} />
                <NodeList stateName={"debugRouteSearchTo"} defaultIndex={2} />
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => { 
                        const result = debugRouteSearch(debugContext.debugRouteSearchFrom, debugContext.debugRouteSearchTo); 
                        setDebugRouteSearchResult(result);
                    }}    
                >
                    経路計算
                </button>
            </div>
            <div className="col-4">
                <NodeList stateName={"debugSearchMinimumCostNode"} defaultIndex={0} />
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => { 
                        const result = debugEachNodes(debugContext.debugSearchMinimumCostNode);
                        setDebugRouteSearchResult(result);
                    }}    
                >
                    最小コストのノード検索
                </button>
            </div>
            <div className="col-4">
                起点ノード
                <NodeList stateName={"debugStartNNode"} defaultIndex={0} />
                隣接n件
                <input type="text" className="form-control" defaultValue="2" onChange={(e) => setNumberOfNodes(e.target.value)} />
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                        const result = debugCalcTopNNodes(debugContext.debugSearchMinimumCostNode, numberOfNodes);
                        setDebugRouteSearchResult(result);
                    }}    
                >
                    隣接N件経路計算
                </button>
            </div>
        </div>
        <div className="row">
            <div key={"debug_route_search_result"}>{debugRouteSearchResult}</div>
        </div>
        </>
    )
}