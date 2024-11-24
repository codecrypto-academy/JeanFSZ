import { Route, Routes } from "react-router-dom";
import Transactions from "./transactions";

const TransactionRoutes = () => (
  <Routes>
    <Route path="" element={<Transactions />} />
  </Routes>
);

export default TransactionRoutes;
