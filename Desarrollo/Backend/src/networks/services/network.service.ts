import { exec } from "child_process";
import { NetworkConfig } from "../../interfaces/interfaces";
import logger from "../../utils/logger";
import { networkRepository } from "../repository/network.repository";
import {
  generateDockerComposeFile,
  getNetworkPath,
} from "../utils/network.utils";
import { assignPorts } from "../utils/node.utils";

export const networkService = {
  createNetwork: (networkConfig: NetworkConfig) => {
    // Lógica para crear la red, validaciones, etc.
    if (
      !networkConfig.id ||
      !networkConfig.nodos ||
      networkConfig.nodos.length === 0
    ) {
      throw new Error("Network configuration is invalid.");
    }

    // Agregar la red al repositorio
    networkRepository.addNetwork(assignPorts(networkConfig));

    // Generar el archivo docker-compose.yml
    generateDockerComposeFile(networkConfig);

    return networkConfig;
  },
  getAllNetworks: () => networkRepository.getAllNetworks(),
  getNetworkById: (id: string) => networkRepository.getNetworkById(id),
  updateNetwork: (networkId: string, updatedConfig: Partial<NetworkConfig>) => {
    // Buscar la red existente
    const network = networkRepository.getNetworkById(networkId);
    if (!network) {
      throw new Error(`Network with ID ${networkId} not found.`);
    }

    // Validar los datos del nuevo config parcialmente
    if (updatedConfig.nodos && updatedConfig.nodos.length === 0) {
      throw new Error("Updated configuration must have at least one node.");
    }

    // Actualizar los campos permitidos
    const updatedNetwork = {
      ...network, // Mantener configuración existente
      ...updatedConfig, // Sobrescribir con los valores nuevos
    };

    // Guardar la configuración actualizada en el repositorio
    networkRepository.updateNetwork(networkId, updatedNetwork);

    // Si hay cambios relevantes, regenerar el archivo docker-compose.yml
    if (updatedConfig.nodos) {
      generateDockerComposeFile(updatedNetwork);
      logger.info("Docker-compose file regenerated for network", { networkId });
    }

    logger.info("Network updated successfully", { networkId, updatedConfig });
    return updatedNetwork;
  },

  // Método para levantar la red (Up)
  upNetwork: (networkId: string) => {
    const network = networkRepository.getNetworkById(networkId);

    if (!network) {
      throw new Error("Network not found.");
    }

    

    const networkPath = getNetworkPath(networkId); // Obtén la ruta de la red específica

    // Ejecutar el comando docker-compose up
    return new Promise<string>((resolve, reject) => {
      exec(
        `docker-compose -f ${networkPath}/docker-compose.yml up -d`, // Usar la ruta correcta
        (error, stdout, stderr) => {
          if (error) {
            logger.error(`Error bringing network up: ${stderr}`, { networkId });
            reject(`Error: ${stderr}`);
          } else {
            logger.info("Network brought up successfully", { networkId });
            networkRepository.updateNetwork(networkId, { up: true });
            resolve(stdout);
          }
        }
      );
    });
  },

  // Método para bajar la red (Down)
  downNetwork: (networkId: string) => {
    const network = networkRepository.getNetworkById(networkId);
    if (!network) {
      throw new Error("Network not found.");
    }

    const networkPath = getNetworkPath(networkId); // Obtén la ruta de la red específica

    // Ejecutar el comando docker-compose down
    return new Promise<string>((resolve, reject) => {
      exec(
        `docker-compose -f ${networkPath}/docker-compose.yml down`, // Usar la ruta correcta
        (error, stdout, stderr) => {
          if (error) {
            logger.error(`Error bringing network down: ${stderr}`, {
              networkId,
            });
            reject(`Error: ${stderr}`);
          } else {
            networkRepository.updateNetwork(networkId, { up: false });
            logger.info("Network brought down successfully", { networkId });
            resolve(stdout);
          }
        }
      );
    });
  },

  getNetworkStatus: (networkId: string) => {
    const network = networkRepository.getNetworkById(networkId);
    if (!network) {
      throw new Error("Network not found.");
    }
    const networkPath = getNetworkPath(networkId);
    return new Promise<string>((resolve, reject) => {
      exec(
        `docker-compose -f  ${networkPath}/docker-compose.yml ps`, // Usa la ruta correcta del archivo docker-compose
        (error, stdout, stderr) => {
          if (error) {
            logger.error(`Error fetching network status: ${stderr}`, {
              networkId,
            });
            reject(`Error: ${stderr}`);
          } else {
            // Analizar el resultado para obtener un estado claro de "up" o "down"
            let status = "down"; // Asumimos que está "down" si no se encuentra "Up"
            if (stdout.includes("Up")) {
              status = "up"; // Si encontramos "Up" en el resultado, está levantado
            }
            logger.info("Network status retrieved successfully", {
              networkId,
              status,
            });
            resolve(status); // Devolver el estado "up" o "down"
          }
        }
      );
    });
  },
};
