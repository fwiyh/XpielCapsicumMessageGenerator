import React, { useContext } from "react";

import { DebugContext } from "./Debug";

type ParamType = {
    stateName: string,
    defaultIndex: number,
}

export const NodeList = (params: ParamType) => {

    // デバッグの設定値
    const { setConfig, availableNodeInfo } = useContext(DebugContext);

    const locations: JSX.Element[] = [];
    let defaultValue = "";

    // 各regionのnode取得
    for (let i = 0; i < availableNodeInfo.length; i++){
        const node = availableNodeInfo[i];
        // 初期値の設定
        if (i == params.defaultIndex){
            defaultValue = node.nodeId;
        }
        locations.push(
            <option 
                key={node.nodeId + node.regionName + node.nodeName}
                value={node.nodeId}
            >
                {node.nodeId}:{node.regionName}{node.nodeName}
            </option>
        );
    }
    // setConfig(params.stateName, defaultValue);

    return (
        <select 
            className="custom-select" defaultValue={defaultValue}
            onChange={(e) => setConfig(params.stateName, e.target.value)}
        >
            ${locations}
        </select>
    )
}