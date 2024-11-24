import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./reducer/authentication.reducer"; 

// Configuración de la tienda Redux
export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
});

const getStore = () => store;

// Definir RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default getStore;
