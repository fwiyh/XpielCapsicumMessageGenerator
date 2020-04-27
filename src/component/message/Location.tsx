import React, { useContext } from "react";
import { Context } from "../App";

import { Location as LocationType } from "../../entity/LocationEntity";

type Param = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
    // リージョンが持っているlocation
	location: LocationType;
}

export const Location = (params: Param) => {
    const { setLocation } = useContext(Context);
    // region-channel-locationが１セットのデータを扱う
    // params.regionIndex, params.channelIndex, location
    return (
        <label className="btn btn-info"
        onClick={() => {
            setLocation(params.regionIndex, params.channelIndex, params.location);
        }}
        >
            <input 
                type="radio" 
                name={"Choise_Location_" + params.regionIndex + "_" + params.channelIndex}
                defaultValue={params.location.id}
            />
            <span>{params.location.name}</span>
        </label>
    )
}