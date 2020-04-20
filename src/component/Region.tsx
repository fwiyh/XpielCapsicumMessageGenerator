import React, { useContext } from "react";
import { Channels } from "./Channels";

import { Context } from "./Messages";

import { PositionType } from "../types/PositionType";

type ParamType = {
    // Region Index
    index: number,
}

export const Region = (params: ParamType) => {

    const { positions } = useContext(Context);

    const channelElemets: JSX.Element[] = [];
    // Region内チャンネルすべてにlocationを設定する
    for (let i = 0; i < positions.channels.length; i++){
        const channel = positions.channels[i];
        channelElemets.push(
            <div className="btn-group-toggle col-xs-12 col-sm-12" data-toggle="buttons">
                <Channels key={"Region_" + i + "_" + "Channels_" + i} regionIndex={params.index} channelIndex={channel.index} />
            </div>
        );
    }
    
    return (
        <>
            <label>{positions.regions[params.index].name}</label>
            {channelElemets}
        </>
    )
}