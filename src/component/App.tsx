import React from "react";

import ConfigForm from "./ConfigForm";
import { Messages } from "./Messages";

import data from "../data/positions.json";
import { Configurations } from "../data/Configurations";

export const App = () => {
    return (
        <div className="container">
        <Messages {...data} />
        <div id="Message" className="row" style={{height: "1.5rem"}}></div>
        <div className="row">
            <button id="ClipBoard" className="btn-primary">クリップボードにコピー</button>
        </div>
        <div className="row">
            <ConfigForm {...Configurations} />
        </div>
    </div>
    )
}