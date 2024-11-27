import { Request, Response } from "express";
import { networkService } from "../services/network.service";
import logger from "../../utils/logger";
import { exec } from "child_process";
import { networkRepository } from "../repository/network.repository";
import { getNetworkPath } from "../utils/network.utils";

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
};
