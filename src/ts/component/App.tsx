import React from "react";

import ConfigForm from "./ConfigForm";
import { Configurations } from "Configurations";
import Region from "./Region";

export default class App extends React.Component {

    render() {
        return (
            <div className="container">
                <div id="PositionContent"></div>
                <div id="Message" className="row" style={{height: "1.5rem"}}></div>
                <div className="row">
                    <button id="ClipBoard" className="btn-primary">クリップボードにコピー</button>
                </div>
                <ConfigForm {...Configurations} />
                <Region />
            </div>
        )
    }
}