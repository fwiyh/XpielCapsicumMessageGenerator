import lodash from "lodash";

import { Dijkstra } from "../lib/dijkstra";

import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";

const dijkstra = new Dijkstra();

/**
 * 経路検索
 * @param regionMessages 
 */
export const routeSearch = (regionMessages: MessageRegionType[]) => {
    if (regionMessages.length == 0){
        return regionMessages;
    }
    // リージョン・チャンネルのソート
    const messages: MessageRegionType[] = lodash.cloneDeep(regionMessages);
    // チャンネルなしを削除
    messages.forEach(r => { r.nodeInfo = r.nodeInfo.filter(n => n.channelIndexes.length > 0) });
    // リージョン正順
    messages.sort((a, b) => (a.regionIndex - b.regionIndex));
    // ソート
    const resultRegions = optimizeSort(messages);
    sortChannels(resultRegions);
    return resultRegions;
}

/**
 * ソート
 * @param regions リージョンindex順・nodeInfoはすべてチャンネルがあるデータ
 */
const optimizeSort = (regions: MessageRegionType[]) => {
    const resultRegions: MessageRegionType[] = [];
    const firstNode = findFirstNode(regions);

    // 隣接ノード検索の起点になるNodeId
    let previonsNodeId = "";
    // 隣接リージョンの起点になるチャンネルindex
    let lastChannelIndex: number = -1;

    let isFirstRegion = true;
    let isEnd = false;

    regions.forEach(r => {
        const resultNodes: NodeInfoType[] = [];
        while (r.nodeInfo.length > 0) {
            // 最初のリージョンのみ最初のチャンネル指定
            if (isFirstRegion) {
                if (resultNodes.length == 0){
                    resultNodes.push({
                        nodeId: firstNode.nodeId,
                        channelIndexes: firstNode.channelIndexes,
                        nodeIndex: firstNode.nodeIndex,
                    });
                    // 直前情報
                    previonsNodeId = firstNode.nodeId;
                    lastChannelIndex = firstNode.channelIndexes.slice(-1)[0];
                    // 末端判定
                    isEnd = (firstNode.nodeIndex == 0 || firstNode.nodeIndex == r.nodeInfo.length -1);
                    // 対象ノードを選択肢から外す
                    const deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == previonsNodeId);
                    r.nodeInfo.splice(deleteNodeIndex, 1);
                } else {
                    const nextNodes = findNextNodeInRegion(previonsNodeId, r.nodeInfo, isEnd);
                    let targetNode: NodeInfoType;
                    let deleteNodeIndex: number;
                    // チャンネル数の比較
                    switch (nextNodes.length) {
                        case 0:
                            break;
                        case 1:
                            previonsNodeId = nextNodes[0].nodeId;
                            targetNode = <NodeInfoType>r.nodeInfo.find(n => n.nodeId == previonsNodeId);
                            resultNodes.push({
                                nodeId: previonsNodeId,
                                channelIndexes: targetNode.channelIndexes ?? [],
                                nodeIndex: firstNode.nodeIndex,
                            });
                            lastChannelIndex = targetNode.channelIndexes[targetNode.channelIndexes.length-1];
                            // 対象ノードを選択肢から外す
                            deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == previonsNodeId);
                            r.nodeInfo.splice(deleteNodeIndex, 1);
                            break;
                        default:
                            const firstChannels: number[] = <number[]>r.nodeInfo.find(p => p.nodeId == nextNodes[0].nodeId)?.channelIndexes;
                            const secondChannels: number[] = <number[]>r.nodeInfo.find(p => p.nodeId == nextNodes[1].nodeId)?.channelIndexes;
                            // 2番目のノードのチャンネル数が多い場合のみ2番目を選択する
                            previonsNodeId = firstChannels?.length >= secondChannels?.length ? nextNodes[0].nodeId : nextNodes[1].nodeId;
                            targetNode = <NodeInfoType>r.nodeInfo.find(n => n.nodeId == previonsNodeId);
                            resultNodes.push({
                                nodeId: previonsNodeId,
                                channelIndexes: targetNode.channelIndexes ?? [],
                                nodeIndex: firstNode.nodeIndex,
                            });
                            lastChannelIndex = targetNode.channelIndexes[targetNode.channelIndexes.length-1];
                            // 対象ノードを選択肢から外す
                            deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == previonsNodeId);
                            r.nodeInfo.splice(deleteNodeIndex, 1);
                            break;
                    }
                }
            } else {
                // 次のリージョンからは隣接のみ
                const nextNode = <NodeInfoType>findNextNodeInOtherRegion(previonsNodeId, r.nodeInfo, lastChannelIndex);
                resultNodes.push({
                    nodeId: nextNode.nodeId,
                    channelIndexes: r.nodeInfo.find(n => n.nodeId == nextNode.nodeId)?.channelIndexes ?? [],
                    nodeIndex: firstNode.nodeIndex,
                });
                previonsNodeId = nextNode.nodeId;
                // 対象ノードを選択肢から外す
                const deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == nextNode.nodeId);
                r.nodeInfo.splice(deleteNodeIndex, 1);
            }
        }
        resultRegions.push({
            regionIndex: r.regionIndex,
            nodeInfo: resultNodes,
        });
        isFirstRegion = false;
    });
    return resultRegions;
}

    // region内の最初の検索ノード
const findFirstNode = (messages: MessageRegionType[]) => {
    // regionIndexとchannelindexの最小値（上のチャンネルを優先）
    const firstNode = messages[0].nodeInfo.sort((a, b) => (a.channelIndexes[0] - b.channelIndexes[0]));
    return firstNode[0];
}

/**
 * 同じリージョン内の次のノードを検索
 * @param previousNodeId 
 * @param remainingNodes 
 * @param isEnd 
 */
const findNextNodeInRegion = (previousNodeId: string, remainingNodes: NodeInfoType[], isEnd: boolean) => {
    const remainingNodeIds: string[] = remainingNodes.map(n => n.nodeId);
    let nextNodes;
    // 末端の場合は隣接指定
    if (isEnd) {
        nextNodes = dijkstra.calcTop_N_Nodes(previousNodeId, remainingNodeIds, 1);
    } else {
        nextNodes = dijkstra.calcTop_N_Nodes(previousNodeId, remainingNodeIds, remainingNodes.length);
    }
    return nextNodes;
}

/**
 * リージョンを超えたときの最初のノードを検索
 */
const findNextNodeInOtherRegion = (previousNodeId: string, remainingNodes: NodeInfoType[], lastChannelIndex: number) => {
    const remainingNodeIds: string[] = remainingNodes.map(n => n.nodeId);
    // 直前のチャンネルがあればそこ
    let nextNode = remainingNodes.find(n => n.channelIndexes.indexOf(lastChannelIndex) > -1);
    if (nextNode == null) {
        // 隣接検索
        const nextNodes = dijkstra.calcTop_N_Nodes(previousNodeId, remainingNodeIds, 1);
        nextNode = remainingNodes.find(n=> n.nodeId == nextNodes[0].nodeId);
    }
    return nextNode;    
}

/**
 * 隣のリージョンからのチャンネルソートを変更する
 * @param resultNodes 
 */
const sortChannels = (resultRegions: MessageRegionType[]) => {
    const firstRegionIndex = resultRegions[0].regionIndex;
    let lastChannelIndex = resultRegions[0].nodeInfo.slice(-1)[0].channelIndexes.slice(-1)[0];
    const anotherRegionNodes = resultRegions.slice().filter(n => n.regionIndex != firstRegionIndex);
    anotherRegionNodes.forEach(r => {
        // 終端の場合は逆から実行
        r.nodeInfo.forEach(n => {
            const currentIndex = n.channelIndexes.indexOf(lastChannelIndex);
            if (currentIndex > -1){
                // 隣接が端のチャンネルの場合は逆順に並べる
                if (currentIndex == n.channelIndexes.length - 1) {
                    n.channelIndexes.sort((a, b) => (b - a));
                } else {
                    // 直近チャンネルを先頭に移動
                    n.channelIndexes.splice(currentIndex, 1);
                    n.channelIndexes.unshift(lastChannelIndex);
                    // 直前リージョンのチャンネルがある場合はこれを先頭にする
                }
                lastChannelIndex = n.channelIndexes.slice(-1)[0];
            }
        });
    });
}