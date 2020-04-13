import * as data from "../data/positions.json";
import { Location } from "../entity/LocationEntity";
import { Channel } from "../entity/ChannelEntity";
import { CalculatedNode } from "../entity/CalculatedNodeEntity";
import { Dijkstra } from "../libs/dijkstra";
import lodash from "lodash";
import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component<any, any> {

    constructor(props: any) {
      super(props);
      this.state = {
        count: 0
      }
    }
  
    onClick() {
      this.setState({ count: this.state.count + 1});
    }
  
    render() {
      return (
        <div>
          <div>count, { this.state.count }</div>
          <button onClick={ this.onClick.bind(this) }>UP!</button>
        </div>
      );
    }
  }
  
  ReactDOM.render(<Hello />, document.getElementById("Root"));