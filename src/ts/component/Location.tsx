import React, { useContext, useState } from 'react'
import { Context } from "./Region";

type Param = {
	name: string;
}

const Location = (params: Param) => {
    const { setConfig } = useContext(Context);
    // console.log(params);

    // const { id } = useContext();
    return (
        <label className="btn btn-info" style={{display: "block"}}>
            <input type="radio" name={"Choice_Radio" + params.name} defaultValue="" />
            {params.name}
        </label>
    )
}
export default Location;