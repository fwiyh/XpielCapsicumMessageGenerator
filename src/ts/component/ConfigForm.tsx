import React, { createContext } from 'react';
import lodash from "lodash";

import ConfigText from "./ConfigText";

type Param = {
    regionLocation: string;
    location: string;
    locationChannel: string;
    channel: string;
    regionJoin: string;
}

const configContext = {
    regionLocation: "" as string,
    location: "" as string,
    locationChannel: "" as string,
    channel: "" as string,
    regionJoin: "" as string,
    setConfig(key: string, value: string){
        if (key in configContext){
            [key] = value;
        }
        if (key in configContext){
            const k: keyof Param = key as keyof Param;
            configContext[k] = value;
            console.log("key:" + key + ",value1:" + configContext[k]);
        }
        console.log(configContext);
    }
}
export const Context = createContext(configContext);

export default class ConfigForm extends React.Component<Param, Param> {

    constructor(props: Param) {
        super(props);
        this.state = lodash.cloneDeep(props);
    }

    private onChangeConfig(key: string, value: string){
        if (key in this.state){
            const obj = JSON.stringify({[key]: value});
            this.setState(JSON.parse(obj));
            console.log(this.state);
        }
    }

    render() {
        return (
            <div id="Config" className="row">
                <ConfigText 
                    name="リージョン～ロケーション区切り文字" 
                    id="ConfigRegionLocationDelimiter" 
                    value={this.state.regionLocation} 
                    changeConfigEvent={(v) => this.onChangeConfig("regionLocation", v)}
                />
                <ConfigText 
                    name="ロケーション区切り文字" 
                    id="ConfigLocationDelimiter" 
                    value={this.state.location} 
                    changeConfigEvent={(v) => this.onChangeConfig("location", v)}
                />
                <ConfigText 
                    name="ロケーション～チャンネル区切り文字" 
                    id="ConfigLocationChannelDelimiter" 
                    value={this.state.locationChannel} 
                    changeConfigEvent={(v) => this.onChangeConfig("locationChannel", v)}
                />
                <ConfigText 
                    name="チャンネル区切り文字" 
                    id="ConfigChannelDelimiter" 
                    value={this.state.channel} 
                    changeConfigEvent={(v) => this.onChangeConfig("channel", v)}
                />
                <ConfigText 
                    name="リージョン間区切り文字" 
                    id="ConfigRegionJoinDelimiter" 
                    value={this.state.regionJoin} 
                    changeConfigEvent={(v) => this.onChangeConfig("regionJoin", v)}
                />
                <button onClick={r => console.log(this.state)}>aaa</button>
            </div>
        );
    }
}
