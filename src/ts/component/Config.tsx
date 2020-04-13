import React from "react";

export default class Config extends React.Component {

    state = {
        regionLocation: "",
        location: "",
        locationChannel: "",
        channel: "",
        regionJoin: " ",
    };

    render() {
        return (
            <div id="Config">
                <div className="form-group">
                    <label>リージョン～ロケーション区切り文字</label>
                    <input type="text" id="ConfigRegionLocationDelimiter" value={this.state.regionLocation} />
                </div>
                <div className="form-group">
                    <label>ロケーション区切り文字</label>
                    <input type="text" id="ConfigLocationDelimiter" value={this.state.location} />
                </div>
                <div className="form-group">
                    <label>ロケーション～チャンネル区切り文字</label>
                    <input type="text" id="ConfigLocationChannelDelimiter" value={this.state.locationChannel} />
                </div>
                <div className="form-group">
                    <label>チャンネル区切り文字</label>
                    <input type="text" id="ConfigChannelDelimiter" value={this.state.channel} />
                </div>
                <div className="form-group">
                    <label>リージョン間区切り文字</label>
                    <input type="text" id="ConfigRegionJoinDelimiter" value={this.state.regionJoin} />
                </div>
            </div>
        );
    }
}
