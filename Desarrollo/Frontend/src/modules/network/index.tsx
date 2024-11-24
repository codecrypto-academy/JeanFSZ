import { Route, Routes } from "react-router-dom";
import NetworkTable from "./network";
import { NetworkConfig } from "@/shared/interfaces/interfaces";

const networkConfig: NetworkConfig = {
  id: "1",
  chainId: "1001",
  subnet: "172.16.239.0/24",
  ipBootnode: "172.16.239.10",
  alloc: [
    { address: "C077193960479a5e769f27B1ce41469C89Bec299", amount: 100 },
    { address: "A423193960479a5e769f27B1ce41469C89Bee888", amount: 200 },
  ],
  nodos: [
    { type: "rpc", name: "Node RPC 1", ip: "192.168.1.1", port: "8545" },
    { type: "miner", name: "Node Miner 1", ip: "192.168.1.2", port: "30303" },
  ],
};

const NetworkRoutes = () => (
  <Routes>
    <Route path="" element={<NetworkTable networkConfig={networkConfig} />} />
  </Routes>
);

export default NetworkRoutes;
