import React, { useContext } from "react";

import { Context } from "./App";

type ParamType = {
    name: string;
    id: string;
    value: string;
}

export const ConfigText = (param: ParamType) => {
    const { setConfig } = useContext(Context);
    return (
        <div className="form-group">
            <label>{param.name}</label>
            <input type="text"
                id={param.id} 
                defaultValue={param.value} 
                onChange={e => {setConfig(param.id, e.target.value)}}
            />
        </div>
    )
}