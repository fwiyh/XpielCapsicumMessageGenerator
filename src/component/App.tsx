import React, { createContext } from "react";

import { ConfigForm } from "./config/ConfigForm";
import { Messages } from "./message/Messages";
import { PositionType } from "../types/position/PositionType";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";
import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";
import { Debug } from "./debug/Debug";

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
        } else {
            // 更新後を追加してソート
            targetNodeInfo.channelIndexes.push(channelIndex);
            targetNodeInfo.channelIndexes.sort();
        }
    },
    // debug
    getContext() {
        console.log(messageContext.regionMessages);
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
                <form>
                    <Messages regionIndexes={...regionIndexes} />
                    <div id="Message" className="row" style={{ height: "1.5rem" }}></div>
                    <div className="row">
                        <button type="button" id="ClipBoard" className="btn btn-primary">クリップボードにコピー</button>
                    </div>
                    <div className="row">
                        <button type="button" onClick={() => {messageContext.getContext()}} className="btn btn-primary">getContext</button>
                    </div>
                    <ConfigForm {...Configurations} />
                    <Debug />
                </form>
            </div>
        </Context.Provider>
    )
}