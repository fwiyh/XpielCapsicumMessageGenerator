import React, { createContext } from "react";
import { Channel } from "./Channel";

import { PositionType } from "../types/PositionType";

// keyの列挙型を取得するために設定
type RegionContextType = {
    a: string,
    state1: string,
}

type ParamType = {
    name: string,
    positions: PositionType,
}

const regionContext = {
    a: "1" as string,
    state1: "" as string,
}

export const Region = (params: ParamType) => {
    const channels: JSX.Element[] = [];
    for (let i = 0; i < params.positions.channels.length; i++){
        const channel = params.positions.channels[i];
        channels.push(
            <div key={"Region_" + channel.index} className="btn-group-toggle col-xs-12 col-sm-12">
                {channel.name}
                <Channel key={"Channel_" + i} name={channel.name} value={channel.name} />
            </div>
        );
    }
    
    return (
        <div>
            {channels}
        </div>
    )
}