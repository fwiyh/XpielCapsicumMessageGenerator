import React, { createContext, useContext } from 'react'
import { Context } from "./Region";

const Channel = () => {

    const { a } = useContext(Context);
    return (
        <p>{a}</p>
    )
}
export default Channel;