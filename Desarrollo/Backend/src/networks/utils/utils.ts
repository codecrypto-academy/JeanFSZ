import * as fs from "fs";
import * as path from "path";
import { NetworkConfig } from "../../interfaces/interfaces";
import { getNetworkPath } from "./network.utils";
import logger from "../../utils/logger";

function createEnv(networkConfig: NetworkConfig): string {
  const networkDir = getNetworkPath(networkConfig.id);
  logger.error("RUTA")
  logger.error(fs.readFileSync(path.join(networkDir, "bootnode.txt")))
  // Leer la clave del bootnode y construir el enode
  let bootnode = `enode://${fs  
    .readFileSync(path.join(networkDir, "bootnode.txt"))
    .toString()
    .trim()}@${networkConfig.ipBootnode}:0?discport=30301`;
  bootnode = bootnode.replace("\n", "");
  // Leer la dirección etherbase del archivo address.txt
  const etherbase = fs
    .readFileSync(path.join(networkDir, "address.txt"))
    .toString()
    .trim();
  
  // Crear el contenido del archivo .env
  const envContent = `
  BOOTNODE=${bootnode}
  SUBNET=${networkConfig.subnet}
  IPBOOTNODE=${networkConfig.ipBootnode}
  ETHERBASE=${etherbase}
  UNLOCK=${etherbase}
  `;

  return envContent;
}

// Crear y guardar el archivo .env
export function generateEnvFile(networkConfig: NetworkConfig) {
  const networkDir = getNetworkPath(networkConfig.id);

  // Asegurarnos de que el directorio exista
  if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
  }

  // Generar el contenido del archivo .env
  const envContent = createEnv(networkConfig);

  // Escribir el archivo .env en el directorio de la red
  fs.writeFileSync(path.join(networkDir, ".env"), envContent);
}
