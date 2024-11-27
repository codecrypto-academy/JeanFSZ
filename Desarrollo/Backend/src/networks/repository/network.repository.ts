import { NetworkConfig } from "../../interfaces/interfaces";
import fs from "fs";
import path from "path";
import logger from "../../utils/logger";

// Ruta del archivo JSON que simula la base de datos
const filePath = path.join(__dirname, "networks.json");

// Función para leer el archivo JSON y obtener los datos de las redes
const readNetworksFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    logger.error("Error al leer el archivo:", err);
    return [];
  }
};

// Función para escribir las redes en el archivo JSON
const writeNetworksToFile = (networks: NetworkConfig[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(networks, null, 2), "utf-8");
  } catch (err) {
    logger.error("Error al escribir en el archivo:", err);
  }
};

export const networkRepository = {
  addNetwork: (network: NetworkConfig) => {
    const networks = readNetworksFromFile();
    network.up = false;
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
  updateNetwork: (networkId: string, updatedConfig: Partial<NetworkConfig>) => {
    // Leer todas las redes desde el archivo
    const networks = readNetworksFromFile();

    // Buscar la red que coincide con el ID
    const index = networks.findIndex(
      (network: NetworkConfig) => network.id === networkId
    );
    if (index === -1) {
      throw new Error(`Network with ID ${networkId} not found.`);
    }

    // Actualizar los campos de la red encontrada
    const updatedNetwork = {
      ...networks[index], // Mantener los valores actuales
      ...updatedConfig, // Sobrescribir con los valores actualizados
    };

    // Validar los cambios si es necesario (opcional)
    if (updatedConfig.nodos && updatedConfig.nodos.length === 0) {
      throw new Error("Network must have at least one node.");
    }

    // Guardar los cambios en el array
    networks[index] = updatedNetwork;

    // Escribir los cambios de vuelta al archivo
    writeNetworksToFile(networks);

    // Log para indicar éxito
    logger.info("Network updated successfully in repository", {
      networkId,
      updatedConfig,
    });

    return updatedNetwork;
  },
};
