import { Request, Response } from "express";
import { networkService } from "../services/network.service";

export const networkController = {
  createNetwork: (req: Request, res: Response) => {
    try {
      const networkConfig = req.body;
      const createdNetwork = networkService.createNetwork(networkConfig);
      res.status(201).json(createdNetwork);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllNetworks: (req: Request, res: Response) => {
    const networks = networkService.getAllNetworks();
    res.status(200).json(networks);
  },
  getNetworkById: (req: Request, res: Response) => {
    const networkId = req.params.id;
    const network = networkService.getNetworkById(networkId);

    if (network) {
      res.status(200).json(network);
    } else {
      res.status(404).json({ error: "Network not found" });
    }
  },
};
