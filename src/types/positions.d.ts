import { DNode } from '../entity/DNodeEntity';
import { DEdge } from '../entity/DEdgeEntity';
import { Region } from '../entity/RegionEntity';
import { Channel } from '../entity/ChannelEntity';

declare module '*/positions.json' {
	interface Nodes {
		nodes: DNode[];
		edges: DEdge[];
		regions: Region[];
		channels: Channel[];
	}
	const value: Nodes;
	export default value;
}