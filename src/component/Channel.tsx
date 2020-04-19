import React from 'react'
import Location from "./Location";

type Param = {
    name: string;
    value: string;
}

export const Channel = (params: Param) => {
    // ここからregions.locationsの中身すべてを設定
    return (
        <Location name="a-" />
    )
}