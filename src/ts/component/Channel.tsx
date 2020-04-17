import React from 'react'
import Location from "./Location";

type Param = {
    name: string;
    value: string;
}

const Channel = (params: Param) => {
    return (
        <div>
            {params.name}:{params.value}
            <Location name={params.name} />
            <Location name={params.name} />
        </div>
    )
}
export default Channel;