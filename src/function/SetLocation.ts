import { LocationType } from "../types/position/LocationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";
import { PositionType } from "../types/position/PositionType";

/**
 * ロケーション情報を管理する
 */
export const setLocation = (
    regionMessages: MessageRegionType[],
    positions: PositionType,
    regionIndex: number,
    channelIndex: number,
    location: LocationType,
) => {
    // 対象regionの取得
    const targetRegion: MessageRegionType = regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
    // 新規リージョン
    if (targetRegion === undefined) {
        const newNodeInfo: NodeInfoType = {
            nodeId: location.id,
            channelIndexes: [channelIndex],
            nodeIndex: location.index,
            
        }
        const newRegionInfo: MessageRegionType = {
            regionIndex: regionIndex,
            nodeInfo: [newNodeInfo],
        }
        regionMessages.push(newRegionInfo);
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
    const targetNodeInfo = targetRegion.nodeInfo.find(n => n.nodeId == location.id) as NodeInfoType;
    // リージョン内新規ノード
    if (targetNodeInfo === undefined) {
        const newNodeInfo: NodeInfoType = {
            nodeId: location.id,
            channelIndexes: [channelIndex],
            nodeIndex: location.index,
        }
        targetRegion.nodeInfo.push(newNodeInfo);
        return;
    } else {
        // 更新後を追加してソート
        targetNodeInfo.channelIndexes.push(channelIndex);
        targetNodeInfo.channelIndexes.sort();
    }
}