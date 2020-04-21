import React, { createContext } from "react";

import { ConfigForm } from "./ConfigForm";
import { Messages } from "./Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";

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
    setLocation(regionIndex: number, nodeId: string, channelIndex: number) {
        // 対象regionの取得
        const targetRegion: MessageRegionType = messageContext.regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
        // 新規リージョン
        if (targetRegion === undefined) {
            const newNodeInfo: NodeInfoType = {
                nodeId: nodeId,
                channelIndexes: [channelIndex],
                nodeName: "",
                channelNames: [],
            }
            const newRegionInfo: MessageRegionType = {
                regionIndex: regionIndex,
                nodeInfo: [newNodeInfo],
                regionName: "",
            }
            messageContext.regionMessages = [newRegionInfo];
            return;
        }

        // node検索
        const targetNodeInfo: NodeInfoType = targetRegion.nodeInfo.find(n => n.nodeId == nodeId) as NodeInfoType;
        // リージョン内新規ノード
        if (targetNodeInfo === undefined) {
            const newNodeInfo: NodeInfoType = {
                nodeId: nodeId,
                channelIndexes: [channelIndex],
                nodeName: "",
                channelNames: [],
            }
            targetRegion.nodeInfo.push(newNodeInfo);
            return;
        }

        // 既存チャンネルと入れ替え
        const existChannelInNode: NodeInfoType
            = targetRegion.nodeInfo.find(n => {
                                        return n.channelIndexes.indexOf(channelIndex) > -1;
                                    }) as NodeInfoType;
        // 既存チャンネルがある場合は置き換える
        if (existChannelInNode !== undefined) {
            const existChannelIndex: number = existChannelInNode.channelIndexes.indexOf(channelIndex);
            if (existChannelIndex > -1) {
                // あるものは消す
                existChannelInNode.channelIndexes.splice(existChannelIndex, 1);
            }
        }
        // 更新後を追加
        targetNodeInfo.channelIndexes.push(channelIndex);
    },
    // debug
    getContext() {
        console.log(messageContext);
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
    // 更新対象のリージョンを設定
    const regionIndexes: number[] = data.regions.map(r => r.index);
    return (
        <Context.Provider value={messageContext}>
            <div className="container">
                <Messages regionIndexes={...regionIndexes} />
                <div id="Message" className="row" style={{ height: "1.5rem" }}></div>
                <div className="row">
                    <button id="ClipBoard" className="btn-primary">クリップボードにコピー</button>
                </div>
                <ConfigForm {...Configurations} />
            </div>
        </Context.Provider>
    )
}