import { NetworkConfig, Node, Allocation } from "./interfaces"; // Ajusta la ruta de acuerdo a tu estructura de proyecto

// Datos falsos para Node
const fakeNodes: Node[] = [
  {
    type: "rpc",
    name: "RPC Node 1",
    ip: "172.16.239.11",
    port: "8545",
  },
  {
    type: "miner",
    name: "Miner Node 1",
    ip: "172.16.239.12",
    port: "8546",
  },
  {
    type: "normal",
    name: "Node 1",
    ip: "172.16.239.13",
    port: "8547",
  },
  {
    type: "rpc",
    name: "RPC Node 2",
    ip: "172.16.239.14",
    port: "8545",
  },
  {
    type: "miner",
    name: "Miner Node 2",
    ip: "172.16.239.15",
    port: "8546",
  },
];

// Datos falsos para Allocation
const fakeAllocations: Allocation[] = [
  {
    address: "C077193960479a5e769f27B1ce41469C89Bec299",
    amount: 100,
  },
  {
    address: "A1234567890abcdef1234567890abcdef1234567",
    amount: 200,
  },
  {
    address: "B0987654321abcdef0987654321abcdef0987654",
    amount: 50,
  },
  {
    address: "D1234567890abcdef1234567890abcdef1234567",
    amount: 300,
  },
  {
    address: "E0987654321abcdef0987654321abcdef0987654",
    amount: 150,
  },
];

// Datos falsos para NetworkConfig
const fakeNetworkConfigs: NetworkConfig[] = [
  {
    id: "net-1",
    chainId: "1001",
    subnet: "172.16.239.0/24",
    ipBootnode: "172.16.239.10",
    alloc: fakeAllocations,
    nodos: fakeNodes,
  },
  {
    id: "net-2",
    chainId: "1002",
    subnet: "192.168.10.0/24",
    ipBootnode: "192.168.10.10",
    alloc: fakeAllocations,
    nodos: fakeNodes,
  },
  {
    id: "net-3",
    chainId: "1003",
    subnet: "10.0.0.0/24",
    ipBootnode: "10.0.0.10",
    alloc: fakeAllocations,
    nodos: fakeNodes,
  },
];

export { fakeNodes, fakeAllocations, fakeNetworkConfigs };
