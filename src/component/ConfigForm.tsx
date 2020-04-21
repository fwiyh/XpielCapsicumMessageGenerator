import React, { useState, useEffect } from "react";

import { ConfigText } from "./ConfigText";

import { ConfigurationType } from "../types/position/ConfigurationType";

export const ConfigForm = (param: ConfigurationType) => {

    const [displayMode, setDisplay ] = useState("none");

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            // ctrl + shift
            console.log(event.ctrlKey + " " + event.shiftKey + " " + event.keyCode);
            if (event.ctrlKey && event.shiftKey && event.keyCode == 67) {
                const newDisplay = displayMode == "none" ? "block" : "none";
                setDisplay(newDisplay);
            }
        }
        window.addEventListener("keydown", onKeyDown);
    });

    return (
        <div id="Config" style={{display: displayMode}}>
            <ConfigText
                name="リージョン～ロケーション区切り文字"
                id="regionLocation"
                value={param.regionLocation}
            />
            <ConfigText
                name="ロケーション区切り文字"
                id="location"
                value={param.location}
            />
            <ConfigText
                name="ロケーション～チャンネル区切り文字"
                id="locationChannel"
                value={param.locationChannel}
            />
            <ConfigText
                name="チャンネル区切り文字"
                id="channel"
                value={param.channel}
            />
            <ConfigText
                name="リージョン間区切り文字"
                id="regionJoin"
                value={param.regionJoin}
            />
        </div>
    );
}