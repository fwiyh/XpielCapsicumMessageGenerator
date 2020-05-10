import { LocationType } from "./LocationType";

// json data用の型
// region information
export type RegionType = {
	name: string;
	index: number;
	locations: LocationType[];
}