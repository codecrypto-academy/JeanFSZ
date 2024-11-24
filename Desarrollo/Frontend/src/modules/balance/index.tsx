import { Route, Routes } from "react-router-dom";
import Balance from "./balance"; // Importar el componente Balance

const BalanceRoutes = () => (
  <Routes>
    <Route path="" element={<Balance />} />
  </Routes>
);

export default BalanceRoutes;
