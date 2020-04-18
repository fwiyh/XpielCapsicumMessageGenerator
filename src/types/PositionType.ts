import { DNode } from '../entity/DNodeEntity';
import { DEdge } from '../entity/DEdgeEntity';
import { Region } from '../entity/RegionEntity';
import { Channel } from '../entity/ChannelEntity';

export type PositionType = {
	nodes: DNode[];
	edges: DEdge[];
	regions: Region[];
	channels: Channel[];
}