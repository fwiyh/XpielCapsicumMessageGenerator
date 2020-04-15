import * as data from "../data/positions.json";
import { Location } from "../entity/LocationEntity";
import { Channel } from "../entity/ChannelEntity";
import { CalculatedNode } from "../entity/CalculatedNodeEntity";
import { Dijkstra } from "../libs/dijkstra";
import lodash from "lodash";
import React from "react";
import ReactDOM from 'react-dom';

import ConfigForm from "./component/ConfigForm";
import { Configurations } from "Configurations";

ReactDOM.render(<ConfigForm {...Configurations} />, document.getElementById("Root"));
