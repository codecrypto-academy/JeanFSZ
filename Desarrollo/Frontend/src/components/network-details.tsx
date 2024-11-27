import React from 'react';
import { NetworkConfig } from '@/shared/interfaces/interfaces';

interface NetworkDetailProps {
  network: NetworkConfig | null;
}

const NetworkDetail: React.FC<NetworkDetailProps> = ({ network }) => {
  if (!network) {
    return <div className="text-center text-red-500 p-6">No se encontraron detalles de la red.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Título */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Detalles de la Red: {network.id}
      </h2>

      {/* Información de la red */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Chain ID:</span>
          <span className="text-gray-800">{network.chainId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Subnet:</span>
          <span className="text-gray-800">{network.subnet}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">IP Bootnode:</span>
          <span className="text-gray-800">{network.ipBootnode}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Status:</span>
          <span className={`text-${network.up ? 'green' : 'red'}-500`}>
            {network.up ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Número de Nodos:</span>
          <span className="text-gray-800">{network.nodos.length}</span>
        </div>
      </div>

      {/* Información de las Asignaciones (Allocations) */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Asignaciones:</h3>
        <div>
          {network.alloc.length > 0 ? (
            <ul className="space-y-2">
              {network.alloc.map((allocation, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-semibold text-gray-600">Dirección:</span>
                  <span className="text-gray-800">{allocation.address}</span>
                  <span className="font-semibold text-gray-600">Monto:</span>
                  <span className="text-gray-800">{allocation.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay asignaciones para esta red.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkDetail;
