import { NodeInfoType } from "./NodeInfoType";

// MessageType
export type MessageRegionType = {
    // region index
    regionIndex: number;
    // locationId in region
    nodeInfo: NodeInfoType[];
}