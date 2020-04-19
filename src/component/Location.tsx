import React, { useContext, useState } from "react";
// import { Context } from "./Messages";

import { Location as LocationType } from "../entity/LocationEntity";

type Param = {
	location: LocationType;
}

const Location = (params: Param) => {
    // const { setConfig } = useContext(Context);
    // console.log(params);

    // const { id } = useContext();
    return (
        <label className="btn btn-info" style={{display: "block"}}>
            <input type="radio" name={"Choice_Radio" + params.location.id} defaultValue="" />
            <span>{params.location.name}</span>
        </label>
    )
}
export default Location;