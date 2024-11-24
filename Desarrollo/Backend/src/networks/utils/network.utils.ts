import * as fs from "fs";
import * as path from "path";
import { Allocation, NetworkConfig, Node } from "../../interfaces/interfaces";
import { createCuentaBootnode } from "./account.utils";

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

function createBootnodeConfig(ip: string): string {
  return `
  geth-bootnode:
    image: ethereum/client-go:alltools-v1.13.15
    command: 'bootnode --addr ${ip}:30301 --nodekey=/bootnode.key'
    volumes:
      - ./bootnode.key:/bootnode.key
    networks:
      ethnetwork:
        ipv4_address: ${ip}
  `;
}

function createNodeConfig(node: Node): string {
  switch (node.type) {
    case "miner":
      return `
  ${node.name}:
    image: ethereum/client-go:v1.13.15
    volumes:
      - ./${node.name}:/root/.ethereum
      - ./genesis.json:/root/genesis.json
      - ./password.txt:/root/.ethereum/password.sec
      - ./keystore:/root/.ethereum/keystore
    depends_on:
      - geth-bootnode
    networks:
      ethnetwork:
        ipv4_address: ${node.ip}
    entrypoint: sh -c 'geth init /root/genesis.json && geth --nat "extip:${node.ip}" --bootnodes="${process.env.BOOTNODE}" --miner.etherbase ${process.env.ETHERBASE} --mine --unlock ${process.env.UNLOCK} --password /root/.ethereum/password.sec'
  `;
    case "rpc":
      return `
  ${node.name}:
    image: ethereum/client-go:v1.13.15
    volumes:
      - ./${node.name}:/root/.ethereum
      - ./genesis.json:/root/genesis.json
    depends_on:
      - geth-bootnode
    networks:
      ethnetwork:
        ipv4_address: ${node.ip}
    ports:
      - "${node.port}:8545"
    entrypoint: sh -c 'geth init /root/genesis.json && geth --bootnodes="${process.env.BOOTNODE}" --nat "extip:${node.ip}" --netrestrict=${process.env.SUBNET} --http --http.addr "0.0.0.0" --http.port 8545 --http.corsdomain "*" --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'
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
      ethnetwork:
        ipv4_address: ${node.ip}
    entrypoint: sh -c 'geth init /root/genesis.json && geth --bootnodes="${process.env.BOOTNODE}" --nat "extip:${node.ip}" --netrestrict=${process.env.SUBNET}'
  `;
    default:
      return "";
  }
}

function createDockerComposeFile(networkConfig: NetworkConfig): string {
  const bootnodeConfig = createBootnodeConfig(networkConfig.ipBootnode);
  const nodesConfig = networkConfig.nodos
    .map((node) => createNodeConfig(node))
    .join("\n");

  return `
version: '3'
services:
  ${bootnodeConfig}
  ${nodesConfig}
networks:
  ethnetwork:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: ${networkConfig.subnet}
  `;
}

// Crear y guardar el archivo docker-compose.yml
export function generateDockerComposeFile(networkConfig: NetworkConfig) {
  // Generar el archivo genesis.json
  console.info("Generando genesis.json");
  generateGenesisFile(networkConfig);
  createCuentaBootnode(networkConfig.id);
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

function generateGenesisFile(networkConfig: NetworkConfig) {
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
    },
    alloc: {} as { [address: string]: { balance: string } },
    difficulty: "0x400",
    gasLimit: "0x8000000",
  };

  // Asignar los balances en `alloc` basado en `networkConfig.alloc`
  networkConfig.alloc.forEach((allocation: Allocation) => {
    genesis.alloc[allocation.address] = {
      balance: `0x${allocation.amount.toString(16)}`, // Convertir a hexadecimal
    };
  });

  const networkDir = getNetworkPath(networkConfig.id);

  if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
  }

  // Escribir el archivo genesis.json en el directorio de la red
  fs.writeFileSync(
    path.join(networkDir, "genesis.json"),
    JSON.stringify(genesis, null, 2)
  );
}
