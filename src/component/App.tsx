import React, { createContext, useState, Dispatch, SetStateAction } from "react";

import { ConfigForm } from "./config/ConfigForm";
import { Messages } from "./message/Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { Debug } from "./debug/Debug";

import { routeSearch } from "../function/RouteSearch";
import { LocationType } from "../types/position/LocationType";
import { setLocation } from "../function/SetLocation";
import { buildMessage } from "../function/BuildMessage";

const messageContext = {
    // message config
    regionLocation: "" as string,
    location: "" as string,
    locationChannel: "" as string,
    channel: "" as string,
    regionJoin: "" as string,
    setConfig(key: string, value: string){
        if (key in messageContext){
            const k = key as keyof ConfigurationType;
            messageContext[k] = value;
        }
    },
    // position information from json-data
    positions: {} as PositionType,
    // result data
    regionMessages: [] as MessageRegionType[],
    // resultMessage 
    resultMessage: "" as string,
    // regionMessagesに値を設定する
    putLocation(regionIndex: number, channelIndex: number, location: LocationType) {
        setLocation(messageContext.regionMessages, regionIndex, channelIndex, location);
    },
    // message更新処理（config/messageが変更したときに呼ぶ）
    changeMessaage(){
        const resultRoute = routeSearch(messageContext.regionMessages);
        const resultMessage = buildMessage(resultRoute, messageContext, messageContext.positions);
        messageContext.setResultMessage(resultMessage);
    },
    // setState用の関数
    setResultMessage: {} as Dispatch<SetStateAction<string>>,
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

    // メッセージ出力の処理をcontextに設定
    const [ resultMessage, setResultMessage ] = useState("");
    messageContext.setResultMessage = setResultMessage;

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