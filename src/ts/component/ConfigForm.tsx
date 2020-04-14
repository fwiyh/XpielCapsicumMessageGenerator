import React from "react";
import lodash from "lodash";

import { ConfigurationEntity } from "../../entity/ConfiguratoinEntity";

export default class ConfigForm extends React.Component<ConfigurationEntity, ConfigurationEntity> {

    constructor(props: ConfigurationEntity){
        super(props);
        this.state = lodash.cloneDeep(props);
    }

    render() {
        return (
            <div id="Config">
                <div className="form-group">
                    <label>リージョン～ロケーション区切り文字</label>
                    <input type="text" id="ConfigRegionLocationDelimiter" defaultValue={this.state.regionLocation} />
                </div>
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
            </div>
        );
    }
}
