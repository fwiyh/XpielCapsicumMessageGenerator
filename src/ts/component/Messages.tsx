import React, { createContext } from "react";
import Channel from "./Channel";

import { Region } from "../../entity/RegionEntity";
import { PositionType } from "../../types/PositionType";

// keyの列挙型を取得するために設定
type MessageContextType = {
    a: string,
    state1: string,
}

// ノード(location)に指定されているチャンネルindex
type NodeInfoType = {
	// node id
	nodeId: string;
	// チャンネルindex
	channelIndexes: number[];
}
type RegionsType = {
	// リージョン名
	regionName: string;
	// リージョンのindex値
	regionIndex: number;
	// リージョン内のソート
	nodeInfo: NodeInfoType[];
}

const messageContext = {
    regions: [] as RegionsType[],
}
export const Context = createContext(messageContext);

const Messages = (params: PositionType) => {
    
    console.log(params);

    const regionElements: JSX.Element[] = [];
    for (let i = 0; i < params.regions.length; i++){
        console.log(params.regions[i]);
        regionElements.push(
            <div key={"Regin_" + params.regions[i].index} />
        );
    }
    console.log(params);
    
    return (
        <div className="row">
            <Context.Provider value={messageContext}>
                {regionElements}
            </Context.Provider>
        </div>
    )
}
export default Messages;