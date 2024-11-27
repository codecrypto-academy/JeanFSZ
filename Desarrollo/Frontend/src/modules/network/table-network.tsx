import { NetworkConfig } from "@/shared/interfaces/interfaces";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NetworkTable: React.FC = () => {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]); // Estado para las redes
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error
  const navigate = useNavigate();

  // Función para cargar datos desde la API
  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<NetworkConfig[]>(
        "http://localhost:3000/api/networks"
      );
      setNetworks(response.data); // Guardar datos en el estado
    } catch (err) {
      setError("Error al cargar los datos de la API.");
    } finally {
      setLoading(false);
    }
  };

  // Función para levantar una red
  const upNetwork = async (id: string) => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:3000/api/networks/${id}/up`);
      fetchNetworks(); // Recargar las redes después de la operación
    } catch (err) {
      setError(`Error al levantar la red ${id}.`);
    } finally {
      setLoading(false);
    }
  };

  // Función para bajar una red
  const downNetwork = async (id: string) => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:3000/api/networks/${id}/down`);
      fetchNetworks(); // Recargar las redes después de la operación
    } catch (err) {
      setError(`Error al bajar la red ${id}.`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los datos cuando el componente se monta
  useEffect(() => {
    fetchNetworks();
  }, []);

  const table = (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr className=" text-center">
          <th scope="col" className="px-6 py-3">
            ID
          </th>
          <th scope="col" className="px-6 py-3">
            Chain ID
          </th>
          <th scope="col" className="px-6 py-3">
            Subnet
          </th>
          <th scope="col" className="px-6 py-3">
            IP Bootnode
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3">
            Número de Nodos
          </th>
          <th scope="col" className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="text-center">
        {networks.map((network) => (
          <tr
            key={network.id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <td className="px-6 py-4 ">{network.id}</td>
            <td className="px-6 py-4">{network.chainId}</td>
            <td className="px-6 py-4">{network.subnet}</td>
            <td className="px-6 py-4">{network.ipBootnode}</td>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${network.up ? "bg-green-500" : "bg-red-500"} me-2`}
                ></div>
                {network.up ? "Online" : "Offline"}
              </div>
            </td>
            <td className="px-6 py-4">{network.nodos.length}</td>
            <td className="px-6 py-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  disabled={network.up}
                  type="button"
                  onClick={() => upNetwork(network.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  Levantar Red
                </button>
                <button
                  disabled={!network.up}
                  type="button"
                  onClick={() => downNetwork(network.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  Bajar Red
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/networks/${network.id}`)} 
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  Ver Detalles
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const loadingContent = (
    <div className="flex justify-center items-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
      <span className="ml-3 text-gray-500">Cargando datos...</span>
    </div>
  );

  const errorContent = (
    <div className="text-red-500 text-center p-6">{error}</div>
  );

  const content = error ? errorContent : table;

  // Renderizar el componente
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Botón para redirigir a la página de crear red */}
      <button
        onClick={() => navigate('/create')}
        className="mb-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
      >
        Crear Nueva Red
      </button>

      {loading ? loadingContent : content}
    </div>
  );
};

export default NetworkTable;
