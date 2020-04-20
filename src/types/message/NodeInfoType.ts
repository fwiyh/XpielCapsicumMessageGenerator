// Node info for message
export type NodeInfoType = {
	// node id = location id
	nodeId: string;
	// channel index
	channelIndexes: number[];

	// location name
	nodeName: string;
	// channel name
	channelNames: string[];
}