import lodash from "lodash";

import { Dijkstra } from "../libs/dijkstra";

import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";

type ResultNodeInfo = {
    nodeId: string,
    channelIndexes: number[],
}
type ResultRegionInfo = {
    regionIndex: number,
    nodeInfos: ResultNodeInfo[],
}

export class RouteSearch {

    private dijkstra = new Dijkstra();

    /**
     * メッセージの作成
     * @param regionMessages 
     */
    buildMessage(regionMessages: MessageRegionType[]){
        if (regionMessages.length == 0){
            return;
        }
        // リージョン・チャンネルのソート
        const messages: MessageRegionType[] = lodash.cloneDeep(regionMessages);
        // チャンネルなしを削除
        messages.forEach(r => { r.nodeInfo = r.nodeInfo.filter(n => n.channelIndexes.length > 0) });
        // リージョン正順
        messages.sort((a, b) => (a.regionIndex - b.regionIndex));

        // ソート
        const resultRegions = this.optimizeSort(messages);
        this.sortChannels(resultRegions);
        return resultRegions;
    }

    /**
     * ソート
     * @param regions リージョンindex順・nodeInfoはすべてチャンネルがあろデータ
     */
    private optimizeSort(regions: MessageRegionType[]) {
        const resultRegions: ResultRegionInfo[] = [];
        const firstNode = this.findFirstNode(regions);

        // 隣接ノード検索の起点になるNodeId
        let previonsNodeId = "";
        // 隣接リージョンの起点になるチャンネルindex
        let lastChannelIndex: number = -1;

        let isFirstRegion = true;

        regions.forEach(r => {
            const resultNodes: ResultNodeInfo[] = [];
            while (r.nodeInfo.length > 0) {
                // 最初のリージョンのみ最初のチャンネル指定
                if (isFirstRegion) {
                    if (resultNodes.length == 0){
                        resultNodes.push({
                            nodeId: firstNode.nodeId,
                            channelIndexes: firstNode.channelIndexes,
                        });
                        // 直前情報
                        previonsNodeId = firstNode.nodeId;
                        lastChannelIndex = firstNode.channelIndexes.slice(-1)[0];
                        // 対象ノードを選択肢から外す
                        const deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == previonsNodeId);
                        r.nodeInfo.splice(deleteNodeIndex, 1);
                    } else {
                        const nextNodes = this.findNextNodeInRegion(previonsNodeId, r.nodeInfo);
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
                    const nextNode = <NodeInfoType>this.findNextNodeInOtherRegion(previonsNodeId, r.nodeInfo, lastChannelIndex);
                    resultNodes.push({
                        nodeId: nextNode.nodeId,
                        channelIndexes: r.nodeInfo.find(n => n.nodeId == nextNode.nodeId)?.channelIndexes ?? [],
                    });
                    // 対象ノードを選択肢から外す
                    const deleteNodeIndex =  r.nodeInfo.findIndex(n => n.nodeId == nextNode.nodeId);
                    r.nodeInfo.splice(deleteNodeIndex, 1);
                }
            }
            resultRegions.push({
                regionIndex: r.regionIndex,
                nodeInfos: resultNodes,
            });
            isFirstRegion = false;
        });
        return resultRegions;
    }

    // region内の最初の検索ノード
    private findFirstNode(messages: MessageRegionType[]){
        // regionIndexとchannelindexの最小値（上のチャンネルを優先）
        const firstNode = messages[0].nodeInfo.sort((a, b) => (a.channelIndexes[0] - b.channelIndexes[0]));
        return firstNode[0];
    }

    /**
     * 同じリージョン内の次のノードを検索
     * @param previousNodeId 
     * @param targetNodes 
     * @param tmpMessages 
     */
    private findNextNodeInRegion(previousNodeId: string, remainingNodes: NodeInfoType[]){
        const remainingNodeIds: string[] = remainingNodes.map(n => n.nodeId);
        const nextNodes = this.dijkstra.calcTop_N_Nodes(previousNodeId, remainingNodeIds, remainingNodes.length);
        return nextNodes;
    }

    /**
     * リージョンを超えたときの最初のノードを検索
     */
    private findNextNodeInOtherRegion(previousNodeId: string, remainingNodes: NodeInfoType[], lastChannelIndex: number){
        const remainingNodeIds: string[] = remainingNodes.map(n => n.nodeId);
        // 直前のチャンネルがあればそこ
        let nextNode = remainingNodes.find(n => n.channelIndexes.indexOf(lastChannelIndex) > -1);
        if (nextNode == null) {
            // 隣接検索
            const nextNodes = this.dijkstra.calcTop_N_Nodes(previousNodeId, remainingNodeIds, 1);
            nextNode = remainingNodes.find(n=> n.nodeId == nextNodes[0].nodeId);
        }
        return nextNode;    
    }

    /**
     * 隣のリージョンからのチャンネルソートを変更する
     * @param resultNodes 
     */
    private sortChannels(resultRegions: ResultRegionInfo[]){
        const firstRegionIndex = resultRegions[0].regionIndex;
        let lastChannelIndex = resultRegions[0].nodeInfos.slice(-1)[0].channelIndexes.slice(-1)[0];
        const anotherRegionNodes = resultRegions.slice().filter(n => n.regionIndex != firstRegionIndex);
        anotherRegionNodes.forEach(r => {
            // 終端の場合は逆から実行
            r.nodeInfos.forEach(n => {
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
}