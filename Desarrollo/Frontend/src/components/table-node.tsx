import React from 'react';
import { Node } from '@/shared/interfaces/interfaces';

interface NodeTableProps {
  nodes: Node[];
}

const NodeTable: React.FC<NodeTableProps> = ({ nodes }) => {
  // Función para asignar un color al badge según el tipo de nodo
  const getNodeBadgeColor = (type: "rpc" | "miner" | "normal") => {
    switch (type) {
      case "rpc":
        return "bg-blue-500 text-white";
      case "miner":
        return "bg-green-500 text-white";
      case "normal":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              URL (IP:PORT)
            </th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 text-center">{index + 1}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getNodeBadgeColor(node.type)}`}>
                  {node.type}
                </span>
              </td>
              <td className="px-6 py-4 text-center">{node.name}</td>
              <td className="px-6 py-4 text-center">
                {/* Mostrar URL solo si el tipo de nodo es 'rpc' */}
                {node.type === 'rpc' ? (
                  <a
                    href={`http://localhost:${node.port}`}
                    className="text-blue-500 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {node.ip}:{node.port}
                  </a>
                ) : (
                  <span>{node.ip}</span> 
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NodeTable;
