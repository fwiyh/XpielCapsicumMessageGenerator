import { ConfigurationType } from "../types/position/ConfigurationType";
import { MessageRegionType } from "../types/message/MessageRegionType";
import { PositionType } from "../types/position/PositionType";

export const buildMessage = (
    resultMesages: MessageRegionType[], 
    configuration: ConfigurationType,
    positions: PositionType,    
) => {
    let retMsgs: string[] = [];
    resultMesages?.forEach(r => {
        const regionName = r.regionIndex;
        let nodeMessages: string[] = [];
        r.nodeInfo.forEach(n => {
            nodeMessages.push(
                getLocatonName(n.nodeId) + 
                configuration.locationChannel + 
                getChannelNames(n.channelIndexes).join(configuration.channel));
        });
        retMsgs.push(getRegionName(regionName) + configuration.regionLocation + nodeMessages.join(configuration.location));
    });
    return retMsgs.join(configuration.regionJoin);

    /**
     * リージョンindexから名称を取得
     * @param regionIndex 
     * @param positions 
     */
    function getRegionName(regionIndex: number) {
        return positions.regions.find(r => r.index == regionIndex)?.name;
    }
    /**
     * ノードIDからノード名の取得
     * @param nodeId 
     */
    function getLocatonName(locationId: string) {
        let regions = positions.regions;
        let labels = regions.flatMap(r => r.locations);
        return labels.find(l => l.id == locationId)?.name;
    }
    /**
     * 複数のチャンネルindexをチャンネル名に変更
     * @param channelIndexes 
     */
    function getChannelNames(channelIndexes: number[]) {
        let channelNames: string[] = [];
        for (let i = 0; i < channelIndexes.length; i++) {
            const f = positions.channels.find(c => c.index == channelIndexes[i]) ?? {message: "?"};
            channelNames.push(f.message);
        }
        return channelNames;
    }
}