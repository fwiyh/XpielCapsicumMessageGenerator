import { DNode } from './DNodeEntity';
import { DEdge } from './DEdgeEntity';
import { Region } from './RegionEntity';
import { Channel } from './ChannelEntity';

export class Position {
	nodes!: DNode[];
	edges!: DEdge[];
	regions!: Region[];
	channels!: Channel[];
}