import React, { createContext, useState } from "react";

import { ConfigForm } from "./config/ConfigForm";
import { Messages } from "./message/Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { Debug } from "./debug/Debug";

import { RouteSearch } from "../libs/RouteSearch";
import { LocationType } from "../types/position/LocationType";
import { LocationInfoManager } from "../libs/LocationInfoManager";

const messageContext = {
    // message config
    regionLocation: "" as string,
    location: "" as string,
    locationChannel: "" as string,
    channel: "" as string,
    regionJoin: "" as string,
    setConfig(key: string, value: string){
        if (key in messageContext){
            const k: keyof ConfigurationType = key as keyof ConfigurationType;
            messageContext[k] = value;
        }
    },
    // position information
    positions: {} as PositionType,
    regionMessages: [] as MessageRegionType[],
    setLocation(regionIndex: number, channelIndex: number, location: LocationType) {
        const buildMessage = new LocationInfoManager(messageContext.regionMessages, messageContext.positions);
        messageContext.regionMessages = buildMessage.getRegionMesages(regionIndex, channelIndex, location);
    },
    // resultMessage
    resultMessage: "" as string,
    // debug
    getContext() {
        const routeSearch = new RouteSearch();
        const resultMesages = routeSearch.buildMessage(messageContext.regionMessages);
        let retMsgs: string[] = [];
        resultMesages?.forEach(r => {
            const regionName = r.regionIndex;
            let nodeMessages: string[] = [];
            r.nodeInfos.forEach(n => {
                nodeMessages.push(
                    n.nodeId + 
                    messageContext.locationChannel + 
                    n.channelIndexes.join(messageContext.channel));
            });
            retMsgs.push(regionName + messageContext.regionLocation + nodeMessages.join(messageContext.location));
        });
        messageContext.resultMessage = retMsgs.join(messageContext.regionJoin);
    },
}
export const Context = createContext(messageContext);

export const App = () => {
    // configデータを設定
    for (const key in Configurations){
        const k: keyof ConfigurationType = key as keyof ConfigurationType;
        messageContext[k] = Configurations[k];
    }
    // contextにデータを追加
    messageContext.positions = data;

    const [ resultMessage, setMessage ] = useState("");

    // 更新対象のリージョンを設定
    const regionIndexes: number[] = data.regions.map(r => r.index);
    return (
        <Context.Provider value={messageContext}>
            <div className="container">
                <form>
                    <Messages regionIndexes={...regionIndexes} />
                    <div id="Message" className="row" style={{ height: "1.5rem" }}>{resultMessage}</div>
                    <div className="row">
                        <button type="button" id="ClipBoard" className="btn btn-primary">クリップボードにコピー</button>
                    </div>
                    <div className="row">
                        <button type="button" onClick={() => {messageContext.getContext(); setMessage(messageContext.resultMessage);}} className="btn btn-primary">getContext</button>
                    </div>
                    <ConfigForm {...Configurations} />
                    <Debug />
                </form>
            </div>
        </Context.Provider>
    )
}