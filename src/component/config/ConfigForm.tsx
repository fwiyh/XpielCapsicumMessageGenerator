import React, { useState, useEffect, memo } from "react";

import { ConfigText } from "./ConfigText";

import { ConfigurationType } from "../../types/position/ConfigurationType";

export const ConfigForm = memo((param: ConfigurationType) => {

    const [ displayMode, setDisplay ] = useState("none");

    useEffect(() => {
        // キーダウンイベント
        const onKeyDown = (event: KeyboardEvent) => {
            // ctrl + altKey + c
            if (event.ctrlKey && event.altKey && event.keyCode == 67) {
                const newDisplay = displayMode == "none" ? "block" : "none";
                setDisplay(newDisplay);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        // returnでイベントを削除
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [displayMode]);

    return (
        <div id="Config" className="row" style={{display: displayMode}}>
            <ConfigText
                name="チャンネル区切り文字"
                id="channel"
                value={param.channel}
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
                name="リージョン～ロケーション区切り文字"
                id="regionLocation"
                value={param.regionLocation}
            />
            <ConfigText
                name="リージョン間区切り文字"
                id="regionJoin"
                value={param.regionJoin}
            />
        </div>
    );
});