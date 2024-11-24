import { NetworkConfig } from "../../interfaces/interfaces";
import fs from "fs";
import path from "path";

// Ruta del archivo JSON que simula la base de datos
const filePath = path.join(__dirname, "networks.json");

// Función para leer el archivo JSON y obtener los datos de las redes
const readNetworksFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    return [];
  }
};

// Función para escribir las redes en el archivo JSON
const writeNetworksToFile = (networks: NetworkConfig[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(networks, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al escribir en el archivo:", err);
  }
};

export const networkRepository = {
  addNetwork: (network: NetworkConfig) => {
    const networks = readNetworksFromFile();
    networks.push(network);
    writeNetworksToFile(networks);
  },

  getAllNetworks: () => {
    return readNetworksFromFile();
  },

  getNetworkById: (id: string): NetworkConfig | undefined => {
    const networks = readNetworksFromFile(); 
    return networks.find((n: NetworkConfig) => n.id === id); 
  },
};
