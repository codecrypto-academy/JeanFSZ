import { execSync, spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import logger from "../../utils/logger";
import { generateEnvFile } from "./utils";
import { NetworkConfig } from "../../interfaces/interfaces";

// Función para generar una contraseña aleatoria
function generatePassword(length: number = 16): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

// Función para generar la cuenta del bootnode
/**
 * Genera la cuenta para el bootnode utilizando un comando Docker ejecutado de forma sincrónica.
 * @param pathNetwork Ruta en la que se montará el volumen en el contenedor Docker.
 */
export async function generateBootnodeAccount(pathNetwork: string): Promise<void> {
  // Asegurar que el directorio exista
  const absolutePathNetwork = path.resolve(pathNetwork);
  if (!fs.existsSync(absolutePathNetwork)) {
    fs.mkdirSync(absolutePathNetwork, { recursive: true });
  }

  // Crear el archivo password.txt
  const password = generatePassword();
  const passwordFilePath = path.join(absolutePathNetwork, "password.txt");
  fs.writeFileSync(passwordFilePath, password, { encoding: "utf-8" });
  console.info(`Contraseña generada y guardada en ${passwordFilePath}`);

  // Configurar los argumentos del comando Docker
  const dockerArgs = [
    "run",
    "--rm",
    "-v",
    `${absolutePathNetwork}:/root`,
    "ethereum/client-go:alltools-v1.13.15",
    "sh",
    "-c",
    "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt && bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode.txt",
  ];

  console.info("Ejecutando el comando Docker para generar bootnode...");

  return new Promise((resolve, reject) => {
    const dockerProcess = spawn("docker", dockerArgs);

    // Manejar la salida en tiempo real
    dockerProcess.stdout.on("data", (data) => {
      console.log(`STDOUT: ${data}`);
    });

    dockerProcess.stderr.on("data", (data) => {
      console.error(`STDERR: ${data}`);
    });

    dockerProcess.on("close", (code) => {
      if (code === 0) {
        console.info("Cuenta y clave del bootnode generadas exitosamente.");
        resolve();
      } else {
        console.error(`El comando Docker terminó con código de salida ${code}.`);
        reject(new Error(`Docker process exited with code ${code}`));
      }
    });

    dockerProcess.on("error", (err) => {
      console.error("Error al ejecutar el proceso Docker:", err);
      reject(err);
    });
  });
}

// Función principal que maneja la creación de la cuenta y la clave del bootnode
export async function createCuentaBootnode(networkConfig: NetworkConfig): Promise<void> {
  // Obtener la ruta al directorio raíz del proyecto
  const networkDir = `src/docker/${networkConfig.id}`;
  const pathNetwork = path.join(process.cwd(), networkDir);
  logger.error(pathNetwork); // Log para verificar la ruta

  // Asegurarse de que el directorio exista antes de ejecutar el comando
  if (!fs.existsSync(pathNetwork)) {
    fs.mkdirSync(pathNetwork, { recursive: true });
  }

 // Esperar a que se genere el bootnode
 await generateBootnodeAccount(pathNetwork);

 // Generar el archivo env después de que el bootnode se haya creado
 generateEnvFile(networkConfig);
}
