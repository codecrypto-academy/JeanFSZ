import { NetworkConfig } from "../../interfaces/interfaces";
import { networkRepository } from "../repository/network.repository";
import { generateDockerComposeFile } from "../utils/network.utils";


export const networkService = {
  createNetwork: (networkConfig: NetworkConfig) => {
    // Lógica para crear la red, validaciones, etc.
    if (!networkConfig.id || !networkConfig.nodos || networkConfig.nodos.length === 0) {
      throw new Error('Network configuration is invalid.');
    }

    // Agregar la red al repositorio
    networkRepository.addNetwork(networkConfig);

    // Generar el archivo docker-compose.yml
    generateDockerComposeFile(networkConfig);

    return networkConfig;
  },
  getAllNetworks: () => networkRepository.getAllNetworks(),
  getNetworkById: (id: string) => networkRepository.getNetworkById(id),
};
