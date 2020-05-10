import { NodeType } from "./NodeType";
import { EdgeType } from "./EdgeType";
import { RegionType } from "./RegionType";
import { ChannelType } from "./ChannelType";

// json data用の型
export type PositionType = {
	nodes: NodeType[];
	edges: EdgeType[];
	regions: RegionType[];
	channels: ChannelType[];
}