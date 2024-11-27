import { Route, Routes } from "react-router-dom";
import NetworkTable from "@/modules/network/table-network";
import NetworkDetailWithTabs from "./network-detail";
import DynamicForm from "./create-network";

const NetworkRoutes = () => (
  <Routes>
    <Route path="/" element={<NetworkTable />} />
    <Route path="/:id" element={<NetworkDetailWithTabs />} />
    <Route path="/create" element={<DynamicForm />} />{" "}
    {/* Nueva ruta de creación */}
  </Routes>
);

export default NetworkRoutes;
