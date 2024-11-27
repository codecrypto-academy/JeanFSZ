import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NetworkDetail from '@/components/network-details';
import { NetworkConfig } from '@/shared/interfaces/interfaces';
import NodeTable from '@/components/table-node';

const NetworkDetailWithTabs: React.FC = () => {
  const { id } = useParams(); // Obtener el id de la red desde la URL
  const [network, setNetwork] = useState<NetworkConfig | null>(null); // Estado para los detalles de la red
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  const [activeTab, setActiveTab] = useState<'details' | 'nodes'>('details'); // Estado para controlar la tab activa

  // Función para cambiar de tab
  const handleTabChange = (tab: 'details' | 'nodes') => {
    setActiveTab(tab);
  };

  // Cargar los detalles de la red cuando el componente se monta
  useEffect(() => {
    if (id) {
      const fetchNetwork = async () => {
        try {
          const response = await axios.get<NetworkConfig>(`http://localhost:3000/api/networks/${id}`);
          setNetwork(response.data);
        } catch (err) {
          setError('Error al cargar los detalles de la red.');
        } finally {
          setLoading(false);
        }
      };

      fetchNetwork();
    }
  }, [id]);

  // Si está cargando, mostrar el mensaje de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-3 text-gray-500">Cargando detalles...</span>
      </div>
    );
  }

  // Si ocurre un error, mostrar el mensaje de error
  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              onClick={() => handleTabChange('details')}
              className={`inline-flex items-center justify-center p-4 border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-600'
              }`}
            >
              Detalles
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleTabChange('nodes')}
              className={`inline-flex items-center justify-center p-4 border-b-2 ${
                activeTab === 'nodes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-600'
              }`}
            >
              Nodos
            </button>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        {activeTab === 'details' && <NetworkDetail network={network} />}
        {activeTab === 'nodes' && network && <NodeTable nodes={network.nodos} />}
      </div>
    </div>
  );
};

export default NetworkDetailWithTabs;
