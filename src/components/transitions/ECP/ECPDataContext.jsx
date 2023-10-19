import React, { createContext, useContext, useState } from "react";

const GetDataContext = createContext();

export const useGetData = () => {
  const context = useContext(GetDataContext);
  if (!context) {
    throw new Error("useGetData must be used within a GetDataProvider");
  }
  return context;
};

export const GetDataProvider = ({ children }) => {
  const [collectors, setCollectors] = useState([]);

  const addCollector = (func) => {
    setCollectors((prev) => [...prev, func]);
  };

  const removeCollector = (func) => {
    setCollectors((prev) => prev.filter((f) => f !== func));
  };

  // This function will be called to collect all data from registered functions
  const collectAll = () => {
    return collectors.map((collector) => collector());
  };

  return (
    <GetDataContext.Provider
      value={{ collectors, addCollector, removeCollector, collectAll }}>
      {children}
    </GetDataContext.Provider>
  );
};
