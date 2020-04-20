import React, { useContext } from "react";
import { Location } from "./Location";

import { Context } from "./Messages";

import { Location as LocationType } from "../entity/LocationEntity";

type ParamType = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
}

export const Channels = (params: ParamType) => {

    const { positions } = useContext(Context);

    // index順にソート
    const regionLocations = positions.regions[params.regionIndex].locations.sort((a, b) => a.index - b.index);

    // ここからregions.locationsの中身すべてを設定
    const locations: JSX.Element[] = [];
    // Region内チャンネルすべてにlocationを設定する
    for (let i = 0; i < regionLocations.length; i++){
        const locationData: LocationType = regionLocations[i];
        locations.push(
            <>
            <Location 
                key={"Location_" + params.regionIndex} 
                regionIndex={params.regionIndex} 
                channelIndex={params.channelIndex} 
                location={locationData} 
            />
            </>
        );
    }

    return (
        <>
            <label>{positions.channels[params.channelIndex].name}</label>
            {locations}
        </>
    )
}