import React from "react";
import lodash from "lodash";

type Param = {
    name: string;
    id: string;
    value: string;
    changeConfigEvent: (arg1: string) => void ;
}

export default class ConfigText extends React.Component<Param> {
    
    constructor(props: Param){
        super(props);
        // this.state = lodash.cloneDeep(props);
    }

    render() {
        return (
        <div className="form-group">
            <label>{this.props.name}</label>
            <input type="text" id={this.props.id} 
                defaultValue={this.props.value} 
                onChange={e => {this.props.changeConfigEvent(e.target.value)}}
            />
        </div>
        )
    }
}