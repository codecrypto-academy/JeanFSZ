import { Route, Routes } from "react-router-dom";
import NetworkTable from "@/components/ui/table-network";


const NetworkRoutes = () => (
  <Routes>
    <Route path="" element={<NetworkTable  />} />
  </Routes>
);

export default NetworkRoutes;
