import React from "react";
import { NetworkConfig } from "../../shared/interfaces/interfaces";
interface NetworkTableProps {
  networkConfig: NetworkConfig;
}

const NetworkTable: React.FC<NetworkTableProps> = ({ networkConfig }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Node Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              IP
            </th>
            <th scope="col" className="px-6 py-3">
              Port
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {networkConfig.nodos.map((node, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              } border-b dark:border-gray-700`}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {node.name}
              </th>
              <td className="px-6 py-4">{node.type}</td>
              <td className="px-6 py-4">{node.ip}</td>
              <td className="px-6 py-4">{node.port}</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
        Allocations
      </h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {networkConfig.alloc.map((allocation, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              } border-b dark:border-gray-700`}
            >
              <td className="px-6 py-4">{allocation.address}</td>
              <td className="px-6 py-4">{allocation.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NetworkTable;
