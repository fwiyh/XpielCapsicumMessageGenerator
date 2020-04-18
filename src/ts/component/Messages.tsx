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
    
    const regions: JSX.Element[] = [];
    for (const region in params.regions){
        console.log(region);
        // regions.push(
        //     <div id={"Regin_" + region} />
        // );
    }
    console.log(params);
    
    return (
        <div className="row">
            <Context.Provider value={messageContext}>
                {/* {regions} */}
            </Context.Provider>
        </div>
    )
}
export default Messages;