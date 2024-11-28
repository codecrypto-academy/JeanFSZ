import * as fs from "fs";
import * as path from "path";
import { Allocation, NetworkConfig, Node } from "../../interfaces/interfaces";
import { createCuentaBootnode } from "./account.utils";
import logger from "../../utils/logger";
import { execSync } from "child_process";
import { ethers } from "ethers";

/**
 * Obtiene el path de la red basado en el nombre de la red y la estructura base.
 *
 * @param networkId - Identificador único de la red.
 * @returns Ruta completa al directorio de la red.
 */
export function getNetworkPath(networkId: string): string {
  // Base para las redes dentro de `src`
  const baseDir = path.join(__dirname, "../../docker");
  return path.join(baseDir, networkId);
}

function createBootnodeConfig(ip: string, networkName: string): string {
  return `
  geth-bootnode:
    image: ethereum/client-go:alltools-v1.13.15
    command: 'bootnode --addr ${ip}:30301 --nodekey=/bootnode.key'
    volumes:
      - ./bootnode.key:/bootnode.key
    networks:
     ${networkName}:
        ipv4_address: ${ip}
  `;
}

function createNodeConfig(node: Node, networkName: string): string {
  switch (node.type) {
    case "miner":
      return `
  ${node.name}:
    image: ethereum/client-go:v1.13.15
    volumes:
      - ./genesis.json:/root/genesis.json
      - ./${node.name}:/root/.ethereum
      - ./password.txt:/root/.ethereum/password.sec
      - ./keystore:/root/.ethereum/keystore
    depends_on:
      - geth-bootnode
    networks:
      ${networkName}:
        ipv4_address: ${node.ip}
    entrypoint: sh -c 'geth init /root/genesis.json && geth --nat "extip:${node.ip}" --bootnodes="\${BOOTNODE}" --miner.etherbase \${ETHERBASE} --mine --unlock \${UNLOCK} --password /root/.ethereum/password.sec'
  `;
    case "rpc":
      return `
  ${node.name}:
    image: ethereum/client-go:v1.13.15
    volumes:
      - ./genesis.json:/root/genesis.json
      - ./${node.name}:/root/.ethereum
    depends_on:
      - geth-bootnode
    networks:
      ${networkName}:
        ipv4_address: ${node.ip}
    ports:
      - "${node.port}:8545"
    entrypoint: sh -c 'geth init /root/genesis.json && geth --bootnodes="\${BOOTNODE}" --nat "extip:${node.ip}" --netrestrict=\${SUBNET} --http --http.addr "0.0.0.0" --http.port 8545 --http.corsdomain "*" --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'
  `;
    case "normal":
      return `
  ${node.name}:
    image: ethereum/client-go:v1.13.15
    volumes:
      - ./${node.name}:/root/.ethereum
      - ./genesis.json:/root/genesis.json
    depends_on:
      - geth-bootnode
    networks:
      ${networkName}:
        ipv4_address: ${node.ip}
    entrypoint: sh -c 'geth init /root/genesis.json && geth --bootnodes="\${BOOTNODE}" --nat "extip:${node.ip}" --netrestrict=\${SUBNET}'
  `;
    default:
      return "";
  }
}

function createDockerComposeFile(networkConfig: NetworkConfig): string {
  const networkName = `${networkConfig.id}_ethnetwork`;
  logger.info(`Creating docker-compose.yml for network ${networkName}`);


  const bootnodeConfig = createBootnodeConfig(
    networkConfig.ipBootnode,
    networkName
  );
  const nodesConfig = networkConfig.nodos
    .map((node) => createNodeConfig(node, networkName))
    .join("\n");

  return `
version: '3'
services:
  ${bootnodeConfig}
  ${nodesConfig}
networks:
  ${networkName}:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: ${networkConfig.subnet}
  `;
}

// Crear y guardar el archivo docker-compose.yml
export async function generateDockerComposeFile(
  networkConfig: NetworkConfig
): Promise<void> {
  // Generar el archivo genesis.json
  console.info("Generando genesis.json");
  await createCuentaBootnode(networkConfig);

  generateGenesisFile(networkConfig);

  const dockerComposeContent = createDockerComposeFile(networkConfig);
  const networkDir = path.join(__dirname, "../../docker", networkConfig.id);

  // Asegurarnos de que el directorio exista
  if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
  }

  // Escribir el archivo docker-compose.yml
  fs.writeFileSync(
    path.join(networkDir, "docker-compose.yml"),
    dockerComposeContent
  );
}

function prepareAllocations(
  mainAddress: string,
  allocConfig: Allocation[]
): { [address: string]: { balance: bigint } } {
  const alloc: { [address: string]: { balance: bigint } } = {};

  // Incluir el balance predeterminado para la dirección principal si no está ya en la lista
  alloc[mainAddress] = { balance: BigInt(300000000000000000000) };

  // Añadir las direcciones y balances desde la configuración
  allocConfig.forEach((allocation) => {
    alloc[allocation.address] = {
      balance: ethers.parseEther(allocation.amount.toString()), // Convertir balance a decimal
    };
  });

  return alloc;
}

export function generateGenesisFile(networkConfig: NetworkConfig): void {
  const networkDir = getNetworkPath(networkConfig.id);

  // Leer la dirección principal desde `address.txt`
  const addressFilePath = path.join(networkDir, "address.txt");
  if (!fs.existsSync(addressFilePath)) {
    throw new Error(
      `No se encontró el archivo address.txt en ${addressFilePath}`
    );
  }
  const mainAddress = fs.readFileSync(addressFilePath, "utf-8").trim();

  // Preparar el campo `alloc`
  const allocations = prepareAllocations(mainAddress, networkConfig.alloc);

  // Generar el archivo `genesis.json`
  const genesis = {
    config: {
      chainId: parseInt(networkConfig.chainId),
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      clique: {
        period: 30,
        epoch: 30000,
      },
    },
    difficulty: "1",
    gasLimit: "8000000",
    extradata: `0x0000000000000000000000000000000000000000000000000000000000000000${mainAddress.replace(
      /^0x/,
      ""
    )}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
    alloc: allocations,
  };

  // Crear el directorio de red si no existe
  if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
  }

  // Escribir el archivo `genesis.json`
  const genesisPath = path.join(networkDir, "genesis.json");
  fs.writeFileSync(
    genesisPath,
    JSON.stringify(genesis, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    ),
    "utf-8"
  );
  console.info(`Archivo genesis.json creado en: ${genesisPath}`);
}
