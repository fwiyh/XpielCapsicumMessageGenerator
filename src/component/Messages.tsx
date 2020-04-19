import React, { createContext } from "react";

import { Region } from "./Region";
import { PositionType } from "../types/PositionType";

// ノード(location)に指定されているチャンネルindex
type NodeInfoType = {
	// node id
	nodeId: string;
	// チャンネルindex
	channelIndexes: number[];
}
type RegionsContextType = {
	// リージョン名
	regionName: string;
	// リージョンのindex値
	regionIndex: number;
	// リージョン内のソート
	// nodeInfo: NodeInfoType[];
}

const messageContext = {
    regionName: "" as string,
    regionIndex: "" as string,
    // nodeInfo: [] as NodeInfoType[],
    // regions: [] as RegionsType[],
    setConfig(key: string, value: string){
        if (key in messageContext){
            const k: keyof RegionsContextType = key as keyof RegionsContextType;
            messageContext[k] = value;
            console.log("key:" + k + ",value1:" + messageContext[k]);
        }
    }
}
export const Context = createContext(messageContext);

export const Messages = (params: PositionType) => {
    const regionElements: JSX.Element[] = [];
    for (let i = 0; i < params.regions.length; i++){
        const region = params.regions[i];
        regionElements.push(
            <Region key={"Region_" + i} name={region.name} positions={params} />
        );
    }
    
    return (
        <div className="row">
            <Context.Provider value={messageContext}>
                {regionElements}
            </Context.Provider>
        </div>
    )
}