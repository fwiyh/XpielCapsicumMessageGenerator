import React, { useContext, memo } from "react";

import { Channels } from "./Channels";
import { Context } from "../App";

type ParamType = {
    // Region Index
    index: number,
}

export const Region = memo((params: ParamType) => {

    const { positions } = useContext(Context);
console.log("Region " + params.index);
    const channelElemets: JSX.Element[] = [];
    // Region内チャンネルすべてにlocationを設定する
    for (let i = 0; i < positions.channels.length; i++){
        const channel = positions.channels[i];
        channelElemets.push(
            <div key={"Block_Region_" + params.index + "_" + "Channel_" + i} 
                className="btn-group-toggle col-xs-12 col-sm-12"
                data-toggle="buttons">
                <Channels key={"Region_" + i + "_" + "Channel_" + i} regionIndex={params.index} channelIndex={channel.index} />
            </div>
        );
    }
    
    return (
        <>
            <label>{positions.regions[params.index].name}</label>
            {channelElemets}
        </>
    )
});