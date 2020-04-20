import React, { createContext } from "react";

import { ConfigText } from "./ConfigText";

import { ConfigurationType } from "../types/position/ConfigurationType";

const configContext = {
    regionLocation: "" as string,
    location: "" as string,
    locationChannel: "" as string,
    channel: "" as string,
    regionJoin: "" as string,
    setConfig(key: string, value: string){
        if (key in configContext){
            const k: keyof ConfigurationType = key as keyof ConfigurationType;
            configContext[k] = value;
        }
    }
}
export const context = createContext(configContext);

export const ConfigForm = (param: ConfigurationType) => {
    return (
        <div id="Config">
            <ConfigText 
                name="リージョン～ロケーション区切り文字" 
                id="regionLocation" 
                value={param.regionLocation} 
            />
            <ConfigText 
                name="ロケーション区切り文字" 
                id="location" 
                value={param.location} 
            />
            <ConfigText 
                name="ロケーション～チャンネル区切り文字" 
                id="locationChannel" 
                value={param.locationChannel} 
            />
            <ConfigText 
                name="チャンネル区切り文字" 
                id="channel" 
                value={param.channel} 
            />
            <ConfigText 
                name="リージョン間区切り文字" 
                id="regionJoin" 
                value={param.regionJoin} 
            />
            <button onClick={r => console.log(configContext)}>console.log</button>
        </div>
    );
}