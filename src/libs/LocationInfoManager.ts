import { LocationType } from "../types/position/LocationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";
import { PositionType } from "../types/position/PositionType";

/**
 * ロケーション情報を管理する
 */
export class LocationInfoManager {
	
	private regionMessages: MessageRegionType[];
	private positions: PositionType;
		
	constructor(regionMessages: MessageRegionType[], positions: PositionType) {
		this.regionMessages = regionMessages;
		this.positions = positions;
	}
	
	/**
     * ロケーション指定で実行されるイベント
     * 
     * @param regionIndex 
     * @param channelIndex 
     * @param location 
     * @return this.regionMesages: MessageRegionType[]
     */
	getRegionMesages(regionIndex: number, channelIndex: number, location: LocationType) {
		this.editRegionMessages(regionIndex, channelIndex, location);
		return this.regionMessages;
	}
    
	/**
     * 出力用のメッセージを
     * @param regionIndex 
     * @param channelIndex 
     * @param location 
     */
	private editRegionMessages(regionIndex: number, channelIndex: number, location: LocationType){
        // 対象regionの取得
        const targetRegion: MessageRegionType = this.regionMessages.find(r => r.regionIndex == regionIndex) as MessageRegionType;
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
                regionName: this.positions.regions[regionIndex].name,
            }
            this.regionMessages.push(newRegionInfo);
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
    }

}