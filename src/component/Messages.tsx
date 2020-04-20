import React, { useContext } from "react";

import { Region } from "./Region";

type ParamType = {
    // Region Index
    regionIndexes: number[],
}

export const Messages = (params: ParamType) => {

    const regionElements: JSX.Element[] = [];
    for (let i = 0; i < params.regionIndexes.length; i++){
        regionElements.push(
            <Region key={"Region_" + params.regionIndexes[i]} index={params.regionIndexes[i]} />
        );
    }
    return (
        <div className="row">
            {regionElements}
        </div>
    )
}