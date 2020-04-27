import React, { createContext, useState, Dispatch, SetStateAction } from "react";

import { ConfigForm } from "./config/ConfigForm";
import { Messages } from "./message/Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { Debug } from "./debug/Debug";

import { routeSearch } from "../libs/RouteSearch";
import { LocationType } from "../types/position/LocationType";
import { setLocation } from "../libs/SetLocation";
import { buildMessage } from "../libs/BuildMessage";

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
    // position information from json-data
    positions: {} as PositionType,
    // result data
    regionMessages: [] as MessageRegionType[],
    // resultMessage 
    resultMessage: "" as string,
    setLocation(regionIndex: number, channelIndex: number, location: LocationType) {
        setLocation(messageContext.regionMessages, messageContext.positions, regionIndex, channelIndex, location);
        const resultMesages = routeSearch(messageContext.regionMessages) as MessageRegionType[];
        messageContext.resultMessage = buildMessage(resultMesages, messageContext, messageContext.positions);
    },
}
export const Context = createContext(messageContext);

export const App = () => {
    // configデータを設定
    for (const key in Configurations){
        const k = key as keyof ConfigurationType;
        messageContext[k] = Configurations[k];
    }
    // contextにデータを追加
    messageContext.positions = data;

    const [ resultMessage, setResultMessage ] = useState("");

    // 更新対象のリージョンを設定
    const regionIndexes: number[] = data.regions.map(r => r.index);
    return (
        <Context.Provider value={messageContext}>
            <div className="container">
                <form>
                    <Messages regionIndexes={...regionIndexes} />
                    <div id="Message" className="row" style={{ height: "1.5rem" }}>{resultMessage}</div>
                    <div className="row">
                        <button type="button" id="ClipBoard" onClick={() => {copyToClipboard(); }} className="btn btn-primary">クリップボードにコピー</button>
                    </div>
                    <div className="row">
                        <button type="button" onClick={() => {setResultMessage(messageContext.resultMessage);}} className="btn btn-primary">getContext</button>
                    </div>
                    <ConfigForm {...Configurations} />
                    <Debug />
                </form>
            </div>
        </Context.Provider>
    )
    
    function copyToClipboard() {
        const copyText = document.querySelector("#Message");
        if (copyText != null) {
            const range = document.createRange();
            range.selectNodeContents(copyText);

            const selection = window.getSelection();
            if (selection != null) {
                selection.removeAllRanges();
                selection.addRange(range);

                document.execCommand("copy");
            }
        }
    }
}