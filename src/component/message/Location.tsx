import React, { useContext } from "react";
import { Context } from "../App";

import { LocationType } from "../../types/position/LocationType";

type Param = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
    // リージョンが持っているlocation
	location: LocationType;
}

export const Location = (params: Param) => {
    const { putLocation, setResultMessage } = useContext(Context);
    // region-channel-locationが１セットのデータを扱う
    // params.regionIndex, params.channelIndex, location
    return (
        <label className="btn btn-info"
        onClick={() => {
            const resultMessage2 = putLocation(params.regionIndex, params.channelIndex, params.location);
            setResultMessage(resultMessage2);
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