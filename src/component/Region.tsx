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

    const channels: JSX.Element[] = [];
    // Region内チャンネルすべてにlocationを設定する
    for (let i = 0; i < positions.channels.length; i++){
        const channel = positions.channels[i];
        channels.push(
            <div key={"Region_" + channel.index}>
                <div key={"RegionNameIndex_" + channel.index}>{channel.name}</div>
                <Channels key={"Channel_" + i} index={params.index} />
            </div>
        );
    }
    
    return (
        <div className="btn-group-toggle col-xs-12 col-sm-12" data-toggle="buttons">
            {channels}
        </div>
    )
}