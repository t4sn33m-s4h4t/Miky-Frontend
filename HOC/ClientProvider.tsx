"use client";
import React, { ReactNode } from "react";
import { Persistor, persistStore } from "redux-persist";
import store from "../Store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Create the persistor outside the component
const persistor = persistStore(store);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;