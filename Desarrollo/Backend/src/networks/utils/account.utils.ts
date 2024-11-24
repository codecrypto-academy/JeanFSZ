import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import logger from "../../utils/logger";

// Función para generar la cuenta del bootnode
function generateBootnodeAccount(pathNetwork: string): void {

  // Comando Docker para generar la cuenta
  const cmd = `
    docker run --rm \
    -v ${pathNetwork}:/root \
    ethereum/client-go:alltools-v1.13.15 \
    sh -c "
      geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt && \
      bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode
    "
  `;

  try {
    console.info(`Generando cuenta para el bootnode...`);
    execSync(cmd, { stdio: "inherit" });
    console.info("Cuenta y clave de bootnode generadas exitosamente.");
  } catch (error) {
    console.error("Error al crear la cuenta del bootnode:", error);
    throw error;
  }
}

// Función principal que maneja la creación de la cuenta y la clave del bootnode
export function createCuentaBootnode(network: string): void {
  // Obtener la ruta al directorio raíz del proyecto
  const networkDir = `src/docker/${network}/bootnode`;
  const pathNetwork = path.join(process.cwd(), networkDir);
  logger.error(pathNetwork); // Log para verificar la ruta

  // Asegurarse de que el directorio exista antes de ejecutar el comando
  if (!fs.existsSync(pathNetwork)) {
    fs.mkdirSync(pathNetwork, { recursive: true });
  }

  // Llamar a la función que genera la cuenta del bootnode
  generateBootnodeAccount(pathNetwork);
}
