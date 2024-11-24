import { Route, Routes } from "react-router-dom";
import Loadable from "react-loadable";
import NetworkRoutes from "./modules/network";

const loading = () => <div>Loading...</div>;

// Carga diferida (Lazy Loading) para los módulos de transacciones y saldo
const Transactions = Loadable({
  loader: () =>
    import("./modules/transactions/index").then((module) => module.default),
  loading,
});

const BalanceRoutes = Loadable({
  loader: () =>
    import("./modules/balance/index").then((module) => module.default),
  loading,
});

const NotFound = () => <div>404 - Not Found</div>; // Componente para rutas no encontradas

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="transactions" element={<Transactions />} />
      <Route path="balance/*" element={<BalanceRoutes />} />
      <Route path="networks/*" element={<NetworkRoutes />} />
      {/* Rutas anidadas para Balance */}
      <Route path="*" element={<NotFound />} />
      {/* Ruta que captura cualquier otra ruta */}
    </Routes>
  );
};

export default AppRoutes;
