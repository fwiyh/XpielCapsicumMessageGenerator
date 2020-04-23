import lodash from "lodash";

import { MessageRegionType } from "../types/message/MessageRegionType";

export class RouteSearch {

    // type MessageRegionType = {
    //     regionIndex: number;
    //     nodeInfo: NodeInfoType[];
    //     regionName: string;
    // }
    // type NodeInfoType = {
    //     // node id = location id
    //     nodeId: string;
    //     // channel index
    //     channelIndexes: number[];
    //     // node index
    //     nodeIndex: number;
    
    //     // location name
    //     nodeName: string;
    // }
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

        console.log(messages);
        console.log(this.findFirstNode(messages));
    }

    // region内の最初の検索ノード
    private findFirstNode(messages: MessageRegionType[]){
        // regionIndexとchannelindexの最小値（上のチャンネルを優先）
        const firstNode = messages[0].nodeInfo.sort((a, b) => (a.channelIndexes[0] - b.channelIndexes[0]));
        return firstNode[0];
    }

    private optimizeSort(regions: MessageRegionType[]) {

    }
}