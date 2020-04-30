import React, { useContext, useState } from "react";
import { Location } from "./Location";

import { Context } from "../App";

import { LocationType } from "../../types/position/LocationType";

type ParamType = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
}

export const Channels = (params: ParamType) => {

    const { positions } = useContext(Context);

    // checkedボタンの指定
    const [ checked, setChecked ] = useState("");

    // index順にソート
    const regionLocations = positions.regions[params.regionIndex].locations.sort((a, b) => a.index - b.index);

    // ここからregions.locationsの中身すべてを設定
    const locations: JSX.Element[] = [];
    // Region内チャンネルすべてにlocationを設定する
    for (let i = 0; i < regionLocations.length; i++){
        const locationData: LocationType = regionLocations[i];
        locations.push(
            <Location 
                key={"Block_Channel_Location__" + params.regionIndex + "_" + params.channelIndex + "_" + i} 
                regionIndex={params.regionIndex} 
                channelIndex={params.channelIndex} 
                location={locationData} 
                setChecked={setChecked}
                checked={checked}
            />
        );
    }

    return (
        <>
            <label>{positions.channels[params.channelIndex].name}</label>
            {locations}
        </>
    )
}