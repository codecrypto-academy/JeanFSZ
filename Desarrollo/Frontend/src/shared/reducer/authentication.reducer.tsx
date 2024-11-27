import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NetworkConfig } from "../interfaces/interfaces";

const AUTH_TOKEN_KEY = "jhi-authenticationToken";

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false,
  account: null as string | null,
  errorMessage: null as string | null,
  sessionHasBeenFetched: false,
  balance: null as string | null,
  network: null as NetworkConfig | null,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Helper para obtener la cuenta de MetaMask
export const getAccountFromMetaMask = async (): Promise<string> => {
  const metamaskProvider = (window as any).ethereum;
  if (metamaskProvider) {
    const provider = new ethers.BrowserProvider(metamaskProvider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return (await signer).getAddress();
  }
  throw new Error("MetaMask no está instalado");
};

// Helper para firmar mensaje (este puede ser un mensaje de prueba o nonce)
export const signMessage = async (message: string): Promise<string> => {
  const metamaskProvider = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(metamaskProvider);
  const signer = provider.getSigner();
  return await (await signer).signMessage(message);
};

// Acciones

// Obtener la cuenta de MetaMask
export const getAccount = createAsyncThunk(
  "authentication/getAccount",
  async () => {
    try {
      return await getAccountFromMetaMask();
    } catch (error) {
      throw new Error("Error obteniendo la cuenta de MetaMask");
    }
  }
);

export const setNetwork = createAsyncThunk(
  "authentication/setNetwork",
  async (network: NetworkConfig) => {
    // Aquí puedes agregar lógica para validar la red o realizar acciones adicionales
    return network; // Devuelve el objeto NetworkConfig
  }
);

// Autenticar al usuario firmando un mensaje
export const authenticate = createAsyncThunk(
  "authentication/authenticate",
  async (account: string) => {
    const message = "Autenticación en la aplicación"; // Este puede ser un mensaje fijo o un nonce
    try {
      const signature = await signMessage(message);
      // Enviar la firma al backend si necesitas validar autenticación en el servidor
      return { account, signature };
    } catch (error) {
      throw new Error("Error al autenticar con MetaMask");
    }
  }
);

// Logout
export const logout = createAsyncThunk("authentication/logout", async () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  return null;
});

// Obtener el balance de la cuenta de MetaMask
export const getBalance = createAsyncThunk(
  "authentication/getBalance",
  async (account: string) => {
    const metamaskProvider = (window as any).ethereum;
    if (metamaskProvider) {
      const provider = new ethers.BrowserProvider(metamaskProvider);
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    }
    throw new Error("MetaMask no está instalado");
  }
);

// Reducer con createSlice
export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState as AuthenticationState,
  reducers: {
    clearAuth() {
      return {
        ...initialState,
        sessionHasBeenFetched: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.fulfilled, (state) => {
        state.sessionHasBeenFetched = true;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.loading = false;
        state.loginError = true;
        state.errorMessage = action.error.message ?? null;
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.loginSuccess = true;
        state.isAuthenticated = true;
        state.loading = false;
        state.account = action.payload.account;
        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.signature);
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.loginError = true;
        state.errorMessage = action.error.message ?? null;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      .addCase(getBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload; // Guardamos el balance en el estado
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message ?? null;
      })
      // Otros casos
      .addCase(setNetwork.fulfilled, (state, action) => {
        state.network = action.payload; // Guardamos la red seleccionada
      })
      .addCase(setNetwork.rejected, (state, action) => {
        state.errorMessage =
          action.error.message ?? "Error configurando la red";
      });
  },
});

export const { clearAuth } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
