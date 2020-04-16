import React from "react";
import lodash from "lodash";

import ConfigText from "./ConfigText";

type Param = {
    regionLocation: string;
    location: string;
    locationChannel: string;
    channel: string;
    regionJoin: string;
};

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
            <div id="Config">
                <ConfigText 
                    name="リージョン～ロケーション区切り文字" 
                    id="ConfigRegionLocationDelimiter" 
                    value={this.state.regionLocation} 
                    changeConfigEvent={(v) => this.onChangeConfig("regionLocation", v)}
                />
                <div className="form-group">
                    <label>ロケーション区切り文字</label>
                    <input type="text" id="ConfigLocationDelimiter" defaultValue={this.state.location} />
                </div>
                <div className="form-group">
                    <label>ロケーション～チャンネル区切り文字</label>
                    <input type="text" id="ConfigLocationChannelDelimiter" defaultValue={this.state.locationChannel} />
                </div>
                <div className="form-group">
                    <label>チャンネル区切り文字</label>
                    <input type="text" id="ConfigChannelDelimiter" defaultValue={this.state.channel} />
                </div>
                <div className="form-group">
                    <label>リージョン間区切り文字</label>
                    <input type="text" id="ConfigRegionJoinDelimiter" defaultValue={this.state.regionJoin} />
                </div>
                <button onClick={r => console.log(this.state)}>aaa</button>
            </div>
        );
    }
}
