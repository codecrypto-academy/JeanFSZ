import { Route, Routes } from "react-router-dom";
import NetworkTable from "@/modules/network/table-network";
import NetworkDetailWithTabs from "./network-detail";
import CreateNetwork from "@/modules/network/create-network";  // Este es el nuevo componente

const NetworkRoutes = () => (
  <Routes>
    <Route path="/" element={<NetworkTable />} />
    <Route path="/:id" element={<NetworkDetailWithTabs />} />
    <Route path="/create" element={<CreateNetwork />} />  {/* Nueva ruta de creación */}
  </Routes>
);

export default NetworkRoutes;
