import React, { useContext } from "react";
import { NodeList } from "./NodeList";

export const Debug = () => {

    // node取得

    // findNode

    // calcEachNodes

    // calcTop_N_Nodes


    return (
        <div className="row">
            <div className="col-4">
                <NodeList key={"debug_route_search_from"} defaultIndex={0} />
                <NodeList key={"debug_route_search_to"} defaultIndex={1} />
                <button className="btn btn-secondary">経路計算</button>
            </div>
            <div className="col-4">
                <NodeList key={"debug_min_cost_search_from"} defaultIndex={0} />
                <NodeList key={"debug_min_cost_search_to"} defaultIndex={1} />
                <button className="btn btn-secondary">最小コストのノード検索</button>
            </div>
            <div className="col-4">
                起点ノード
                <NodeList key={"debug_start_node"} defaultIndex={0} />
                隣接n件
                <input type="text" className="form-control" defaultValue="2" />
                <button className="btn btn-secondary">隣接N件経路計算</button>
            </div>
        </div>
    )
}