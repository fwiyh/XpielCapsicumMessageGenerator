import React, { createContext } from 'react';
import Channel from './Channel';

import { Position } from '../../entity/PositionEntity';

// keyの列挙型を取得するために設定
type RegionContextType = {
    a: string,
    state1: string,
}

const regionContext = {
    a: "1" as string,
    state1: "" as string,
    setConfig(key: string, value: string){
        if (key in regionContext){
            const k: keyof RegionContextType = key as keyof RegionContextType;
            regionContext[k] = value;
            console.log("key:" + k + ",value1:" + regionContext[k]);
        }
        console.log(regionContext);
    }
}
export const Context = createContext(regionContext);

const Region = (params: Position) => {
    const channels: JSX.Element[] = [];
    for (const ctx in regionContext){
        const k: keyof RegionContextType = ctx as keyof RegionContextType;
        if (typeof regionContext[k] == "string"){
            channels.push(<Channel key={"Channel_" + k} name={k} value={regionContext[k]} />);
        }
    }
    
    // const regions: JSX.Element[] = [];
    // for (const region in params.regions){
    //     regions.push(
            
    //     );
    // }
    
    return (
        <div className="row">
            {channels}
       </div>
    )
}
export default Region;