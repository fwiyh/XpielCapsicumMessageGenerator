import React, { createContext } from "react";

import { ConfigForm } from "./ConfigForm";
import { Messages } from "./Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";

const messageContext = {
    positions: {} as PositionType,
    regionMessages: [] as MessageRegionType[],
    getContext(){
        console.log(messageContext);
    },
    setLocation(regionIndex: number, nodeId: string, channelIndex: number){
        // 対象regionの取得
        if (messageContext.regionMessages.length == 0){
            const newRegionInfo: MessageRegionType = {
                regionIndex: regionIndex,
                nodeInfo: [],
                regionName: "",
            }
            messageContext.regionMessages = [newRegionInfo];
        } 
        let targetRegion: MessageRegionType = messageContext.regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
        if (messageContext.regionMessages === undefined){
            const newRegionInfo: MessageRegionType = {
                regionIndex: regionIndex,
                nodeInfo: [],
                regionName: "",
            }
            messageContext.regionMessages = [newRegionInfo];
            targetRegion = newRegionInfo;
        }
        console.log(messageContext);
        // node検索
        let nodeInfo = targetRegion.nodeInfo.find(n => n.nodeId == nodeId);
        if (nodeInfo === undefined){
            const newNodeInfo: NodeInfoType = {
                nodeId: nodeId,
                channelIndexes: [channelIndex],
                nodeName: "",
                channelNames: [],
            }
            targetRegion.nodeInfo.push(newNodeInfo);
            nodeInfo = targetRegion.nodeInfo[0];
        }
        console.log(messageContext.regionMessages);

        // 既存チャンネルと入れ替え
        let existChannelRegion = targetRegion.nodeInfo.find(n => {
            n.channelIndexes.find(c => c == channelIndex)
        });
        if (existChannelRegion !== undefined){
            console.log(existChannelRegion);
            const existTargetNode: number | undefined = existChannelRegion.channelIndexes.find(c => {c == channelIndex});
            if (existTargetNode !== undefined){
                existChannelRegion.channelIndexes = existChannelRegion.channelIndexes.filter(c => c != channelIndex);
            }
        }

        // 更新後を追加
        nodeInfo.channelIndexes.push(channelIndex);

        console.log(messageContext.regionMessages);
    },
}
export const Context = createContext(messageContext);

export const App = () => {
    // contextにデータを追加
    messageContext.positions = data;
    // 更新対象のリージョンを設定
    const regionIndexes: number[] = data.regions.map(r => r.index);
    return (
        <Context.Provider value={messageContext}>
            <div className="container">
                <Messages regionIndexes={...regionIndexes} />
                <button onClick={() => {messageContext.getContext()}}>Context</button>
                <div id="Message" className="row" style={{height: "1.5rem"}}></div>
                <div className="row">
                    <button id="ClipBoard" className="btn-primary">クリップボードにコピー</button>
                </div>
                <div className="row">
                    <ConfigForm {...Configurations} />
                </div>
            </div>
        </Context.Provider>
    )
}