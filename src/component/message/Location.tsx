import React, { useContext, useState } from "react";
import { Context } from "../App";

import { LocationType } from "../../types/position/LocationType";

type Param = {
    // Region Index
    regionIndex: number,
    // channel id
    channelIndex: number,
    // リージョンが持っているlocation
    location: LocationType,
    // チェックしているボタンを設定する関数
    setChecked: (nodeId: string) => void,
    // チェック対象
    checked: string,
}

export const Location = (params: Param) => {
    // 位置情報の設定
    const { putLocation, setResultMessage } = useContext(Context);
    // ボタン部分のcss
    const [ defaultStyle, checkedStyle ]: string[] = [ "btn btn-info", "btn btn-info active"];
    
    // region-channel-locationが１セットのデータを扱う
    // params.regionIndex, params.channelIndex, location
    return (
        <label className={params.checked == params.location.id ? checkedStyle : defaultStyle}
            onClick={() => {
                const resultMessage = putLocation(params.regionIndex, params.channelIndex, params.location);
                setResultMessage(resultMessage);
                params.setChecked(params.location.id);
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