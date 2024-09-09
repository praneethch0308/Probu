// SidebarContext.js
import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const [isOpened, setIsOpened] = useState(true);

    const toggleSidebar = (state) => {
        if (typeof state === 'boolean') {
            setIsOpened(state);
        } else {
            setIsOpened(prevState => !prevState);
        }
    };

    return (
        <SidebarContext.Provider value={{ isOpened, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};
