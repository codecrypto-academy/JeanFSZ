export interface Node {
  type: "rpc" | "miner" | "normal";
  name: string;
  ip: string;
  port: string;
}

export interface Allocation {
  address: string; // Address assigned (e.g., "C077193960479a5e769f27B1ce41469C89Bec299")
  amount: number; // Amount assigned to the address (e.g., 100)
}

export interface NetworkConfig {
  id: string;
  chainId: string;
  subnet: string; // Subnet of the network (e.g., "172.16.239.0/24")
  ipBootnode: string; // IP of the bootnode (e.g., "172.16.239.10")
  alloc: Allocation[]; // List of allocated addresses (e.g., ["C077193960479a5e769f27B1ce41469C89Bec299"])
  up: boolean;
  nodos: Node[]; // List of nodes in the network
}
