import React, { useContext } from "react";

import { Context } from "../App";

type ParamType = {
    defaultIndex: number;
}

export const NodeList = (params: ParamType) => {

    const { positions } = useContext(Context);

    const locations: JSX.Element[] = [];
    let defaultValue = "";
    
    // node取得
    for (let i = 0; i < positions.regions.length; i++){
        const region = positions.regions[i];
        for (let j = 0; j < region.locations.length; j++){
            const location = region.locations[j];
            if (i * (region.locations.length -1) + j == params.defaultIndex){
                defaultValue = location.id;
            }
            locations.push(
                <option 
                    key={location.id + region.name + location.name}
                    value={location.id}
                >
                    {location.id}:{region.name}{location.name}
                </option>
            );
        }
    }

    return (
        <select className="custom-select" defaultValue={defaultValue}>
            ${locations}
        </select>
    )
}