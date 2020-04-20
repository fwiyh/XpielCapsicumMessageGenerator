import React, { useContext, useState } from "react";
// import { Context } from "./Messages";

import { Location as LocationType } from "../entity/LocationEntity";

type Param = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
    // リージョンが持っているlocation
	location: LocationType;
}

export const Location = (params: Param) => {
    // const { setConfig } = useContext(Context);
    // console.log(params);

    // const { id } = useContext();
    return (
        <label className="btn btn-info">
            <input 
                type="radio" 
                name={"Choise_Location_" + params.regionIndex + "_" + params.channelIndex}
                defaultValue={params.location.id}
            />
            <span>{params.location.name}</span>
        </label>
    )
}