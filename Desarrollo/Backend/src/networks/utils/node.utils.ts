import { NetworkConfig } from "../../interfaces/interfaces";
import { networkRepository } from "../repository/network.repository";

export function assignPorts(networkConfig: NetworkConfig): NetworkConfig {
    let currentPort = 8545; // Puerto inicial para los nodos RPC
  
    // Obtener los puertos utilizados actualmente desde el repositorio
    const usedPorts = new Set<number>(
      networkRepository.getAllPortsFromRpcNodes().map(Number) // Convertir a números
    );
  
    console.log("Puertos usados actualmente:", Array.from(usedPorts));
  
    // Actualizamos los nodos con puertos únicos
    const nodosConPuertos = networkConfig.nodos.map((node) => {
      if (node.type === "rpc") {
        // Asignar un puerto disponible para nodos RPC
        while (usedPorts.has(currentPort)) {
          currentPort++;
        }
        usedPorts.add(currentPort); // Marcar el puerto como utilizado
        node.port = currentPort; // Asignar el puerto dinámico al nodo
        console.log(`Puerto asignado al nodo ${node.name}: ${currentPort}`);
      }
      return node;
    });
  
    return { ...networkConfig, nodos: nodosConPuertos };
  }