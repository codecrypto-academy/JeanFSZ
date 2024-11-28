import { NextFunction, Request, Response } from "express";
import { networkService } from "../services/network.service";
import logger from "../../utils/logger";
import axios from "axios";

export const networkController = {
  createNetwork: (req: Request, res: Response) => {
    try {
      const networkConfig = req.body;
      logger.info("Creating a new network", { networkConfig });

      const createdNetwork = networkService.createNetwork(networkConfig);

      logger.info("Network created successfully", { createdNetwork });
      res.status(201).json(createdNetwork);
    } catch (error) {
      logger.error("Error creating network", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllNetworks: (req: Request, res: Response) => {
    try {
      logger.info("Fetching all networks");
      const networks = networkService.getAllNetworks();
      res.status(200).json(networks);
    } catch (error) {
      logger.error("Error fetching networks", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getNetworkById: (req: Request, res: Response) => {
    try {
      const networkId = req.params.id;
      logger.info(`Fetching network by ID: ${networkId}`);

      const network = networkService.getNetworkById(networkId);

      if (network) {
        logger.info("Network found", { network });
        res.status(200).json(network);
      } else {
        logger.warn("Network not found", { networkId });
        res.status(404).json({ error: "Network not found" });
      }
    } catch (error) {
      logger.error("Error fetching network by ID", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  upNetworks: (req: Request, res: Response) => {
    try {
      logger.info("Controller: Fetching networks that are up");
      const networks = networkService.upNetworks();
      res.status(200).json(networks);
    } catch (error) {
      logger.error("Controller: Error fetching networks that are up", {
        error,
      });
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  upNetwork: async (req: Request, res: Response): Promise<void> => {
    const networkId = req.params.id;
    try {
      logger.info(`Attempting to bring network up: ${networkId}`);
      const result = await networkService.upNetwork(networkId);
      res
        .status(200)
        .json({ message: "Network brought up successfully", result });
    } catch (error) {
      logger.error(`Error bringing network up: ${error}`, {
        networkId,
      });
      res.status(500).json({ error: "Error bringing network up" });
    }
  },

  // Función para bajar la red
  downNetwork: async (req: Request, res: Response): Promise<void> => {
    const networkId = req.params.id;
    try {
      logger.info(`Attempting to bring network down: ${networkId}`);
      const result = await networkService.downNetwork(networkId);
      res
        .status(200)
        .json({ message: "Network brought down successfully", result });
    } catch (error) {
      logger.error(`Error bringing network down: ${error}`, {
        networkId,
      });
      res.status(500).json({ error: "Error bringing network down" });
    }
  },

  // Función para obtener el estado de la red
  getNetworkStatus: async (req: Request, res: Response): Promise<void> => {
    const networkId = req.params.id;
    try {
      logger.info(`Fetching network status for: ${networkId}`);
      const status = await networkService.getNetworkStatus(networkId);
      res
        .status(200)
        .json({ message: "Network status retrieved successfully", status });
    } catch (error) {
      logger.error(`Error fetching network status: ${error}`, {
        networkId,
      });
      res.status(500).json({ error: "Error fetching network status" });
    }
  },
  deleteNetwork: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      // Call the service to delete the network
      const result = await networkService.deleteNetwork(id);

      if (!result) {
        return res.status(404).json({ message: "Network not found" });
      }

      return res.status(200).json({ message: "Network deleted successfully" });
    } catch (error) {
      logger.error("Error deleting network", { error });
      return res
        .status(500)
        .json({ message: "Internal server error while deleting the network" });
    }
  },

  addTransactionToNetwork: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { networkId } = req.params; // Obtener el networkId de los parámetros de la URL
    const { to, value } = req.body; // Obtener 'to' y 'value' del cuerpo de la solicitud

    try {
      // Validar que 'to' y 'value' están presentes
      if (!to || !value) {
        return res
          .status(400)
          .json({
            error:
              'Faltan parámetros "to" o "value" en el cuerpo de la solicitud',
          });
      }

      // Simulando la búsqueda de la red por su ID (esto dependerá de cómo gestionas tus redes)
      const network = await networkService.getNetworkById(networkId); // Método hipotético para obtener la red

      if (!network) {
        return res.status(404).json({ error: "Red no encontrada" });
      }

      // Buscar el nodo RPC en los nodos de la red
      const rpcNode = network.nodos.find((node) => node.type === "rpc");
      if (!rpcNode) {
        return res.status(404).json({ error: "Nodo RPC no encontrado" });
      }

      // Construir la URL del nodo RPC (suponiendo que el puerto está en el nodo)
      const rpcUrl = `http://localhost:${rpcNode.port}`;

      // Construir la transacción usando los valores recibidos
      const transactionData = {
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        params: [
          {
            from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155", // Dirección de origen (puedes ajustarla según el caso)
            to: to, // Dirección de destino desde el cuerpo de la solicitud
            gas: "0x76c0",
            gasPrice: "0x9184e72a000",
            value: value, // Valor de la transacción desde el cuerpo de la solicitud
            data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675", // Datos de la transacción
          },
        ],
        id: 1,
      };

      // Enviar la transacción al nodo RPC
      const response = await axios.post(rpcUrl, transactionData);

      // Enviar la respuesta de la transacción
      res.status(200).json({
        message: "Transacción enviada correctamente.",
        transactionHash: response.data.result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al procesar la transacción" });
    }
  },
};
