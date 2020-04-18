import React from "react";
import lodash from "lodash";

import ConfigForm from "./ConfigForm";
import Messages from "./Messages";

import data from "../../data/positions.json";
import { Configurations } from "../../data/Configurations";
import { PositionType } from "../../types/PositionType";

const App = () => {
    console.log(data);
    return (
        <div className="container">
        <div id="PositionContent"></div>
        <div id="Message" className="row" style={{height: "1.5rem"}}></div>
        <div className="row">
            <button id="ClipBoard" className="btn-primary">クリップボードにコピー</button>
        </div>
        <ConfigForm {...Configurations} />
        <Messages {...data} />
    </div>
    )
}
export default App;