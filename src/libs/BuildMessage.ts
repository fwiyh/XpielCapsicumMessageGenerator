import { LocationType } from "../types/position/LocationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { NodeInfoType } from "../types/message/NodeInfoType";
import { PositionType } from "../types/position/PositionType";
import { RouteSearch } from "./RouteSearch";
import { ConfigurationType } from "../types/position/ConfigurationType";

// message作成処理
export class BuildMessage {
	
	private regionMessages: MessageRegionType[];
	private positions: PositionType;
	private configurations: ConfigurationType;
		
	constructor(regionMessages: MessageRegionType[], positions: PositionType, configurations: ConfigurationType){
		this.regionMessages = regionMessages;
		this.positions = positions;
		this.configurations = configurations;
	}
	
	// setLocationのラッピング
	getRegionMesages(regionIndex: number, channelIndex: number, location: LocationType) {
		this.editRegionMessages(regionIndex, channelIndex, location);
		return this.regionMessages;
	}
	
	buildMessage(){
		const routeSearch = new RouteSearch();
        const resultMesages = routeSearch.buildMessage(this.regionMessages);
        let retMsgs: string[] = [];
        resultMesages?.forEach(r => {
            const regionName = r.regionIndex;
            let nodeMessages: string[] = [];
            r.nodeInfos.forEach(n => {
                nodeMessages.push(
                    n.nodeId + 
                    this.configurations.locationChannel + 
                    n.channelIndexes.join(this.configurations.channel));
            });
            retMsgs.push(regionName + this.configurations.regionLocation + nodeMessages.join(this.configurations.location));
        });
        return retMsgs.join(this.configurations.regionJoin);
	}
	// regionMessagesの作成
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