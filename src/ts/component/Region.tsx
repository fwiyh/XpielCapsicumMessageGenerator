import React, { createContext, useContext } from 'react';
import Channel from './Channel';

export const Context = createContext({a: "1"});

const Region = () => {
    return (
        <Context.Provider value={{a: "2"}}>
            <Channel />
        </Context.Provider>
    )
}
export default Region;