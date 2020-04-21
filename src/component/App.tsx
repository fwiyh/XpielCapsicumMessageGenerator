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
    getContext() {
        console.log(messageContext);
    },
    setLocation(regionIndex: number, nodeId: string, channelIndex: number) {
        // 対象regionの取得
        let targetRegion: MessageRegionType = messageContext.regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
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
        let targetNodeInfo: NodeInfoType = targetRegion.nodeInfo.find(n => n.nodeId == nodeId) as NodeInfoType;
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
        let existChannelInNode = targetRegion
                                    .nodeInfo
                                    .find(n => {
                                        return n.channelIndexes.find(c => { c == channelIndex });
                                    });
        console.log(existChannelInNode);
        // 既存チャンネルがある場合は置き換える
        if (existChannelInNode !== undefined) {
            const existChannelIndex: number | undefined = existChannelInNode.channelIndexes.findIndex(c => c == channelIndex);
            if (existChannelIndex !=  undefined && existChannelIndex > -1) {
                // あるものは消す
                existChannelInNode.channelIndexes.splice(existChannelIndex, 1);
            }
        }

        // 更新後を追加
        targetNodeInfo.channelIndexes.push(channelIndex);

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
                <button onClick={() => { messageContext.getContext() }}>Context</button>
                <div id="Message" className="row" style={{ height: "1.5rem" }}></div>
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