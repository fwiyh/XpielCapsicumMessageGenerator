import React, { createContext, useState } from "react";

import { ConfigForm } from "./config/ConfigForm";
import { Messages } from "./message/Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";
import { Debug } from "./debug/Debug";

import { RouteSearch } from "../libs/RouteSearch";
import { LocationType } from "../types/position/LocationType";

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
        // 対象regionの取得
        const targetRegion: MessageRegionType = messageContext.regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
        // 新規リージョン
        if (targetRegion === undefined) {
            const newNodeInfo: NodeInfoType = {
                nodeId: location.id,
                channelIndexes: [channelIndex],
                nodeName: location.name,
            }
            const newRegionInfo: MessageRegionType = {
                regionIndex: regionIndex,
                nodeInfo: [newNodeInfo],
                regionName: messageContext.positions.regions[regionIndex].name,
            }
            messageContext.regionMessages.push(newRegionInfo);
            return;
        }

        // リージョン内ノードにチャンネルがある場合は削除
        const existChannelInNode: NodeInfoType
            = targetRegion.nodeInfo.find(n => {
                                        return n.channelIndexes.indexOf(channelIndex) > -1;
                                    }) as NodeInfoType;
        // 既存チャンネルがある場合は置き換える
        if (existChannelInNode !== undefined) {
            const existChannelIndex: number = existChannelInNode.channelIndexes.indexOf(channelIndex);
            if (existChannelIndex > -1) {
                // あるものは消してソート
                existChannelInNode.channelIndexes.splice(existChannelIndex, 1).sort();
            }
        }

        // 削除した後にチャンネルを追加
        const targetNodeInfo: NodeInfoType = targetRegion.nodeInfo.find(n => n.nodeId == location.id) as NodeInfoType;
        // リージョン内新規ノード
        if (targetNodeInfo === undefined) {
            const newNodeInfo: NodeInfoType = {
                nodeId: location.id,
                channelIndexes: [channelIndex],
                nodeName: location.name,
            }
            targetRegion.nodeInfo.push(newNodeInfo);
            return;
        } else {
            // 更新後を追加してソート
            targetNodeInfo.channelIndexes.push(channelIndex);
            targetNodeInfo.channelIndexes.sort();
        }
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