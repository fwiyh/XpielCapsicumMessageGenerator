import lodash from "lodash";

import { MessageRegionType } from "../types/message/MessageRegionType";

export class RouteSearch {

    // type MessageRegionType = {
    //     regionIndex: number;
    //     nodeInfo: NodeInfoType[];
    //     regionName: string;
    // }
    buildMessage(regionMessages: MessageRegionType[]){
        // リージョン・チャンネルのソート
        const messages: MessageRegionType[] = lodash.cloneDeep(regionMessages);
        // チャンネルなしを削除
        messages.forEach(r => { r.nodeInfo = r.nodeInfo.filter(n => n.channelIndexes.length > 0) });
        // リージョン正順
        messages.sort((a, b) => (a.regionIndex - b.regionIndex));

        console.log(messages);
        console.log(this.findFirstNode(messages));
    }

    private findFirstNode(messages: MessageRegionType[]){
        // regionIndexとchannelindexの最小値
        const firstRegion = messages[0];
        let firstNode = firstRegion.nodeInfo[0];
        for (let i = 0; i < firstRegion.nodeInfo.length; i++){
            if (firstNode.channelIndexes[0] > firstRegion.nodeInfo[i].channelIndexes[0]){
                firstNode = firstRegion.nodeInfo[i];
            }
        }
        return firstNode;
    }
}