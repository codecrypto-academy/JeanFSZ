import { Router } from 'express';
import { networkController } from './controllers/network.controller';

const router = Router();

// Definir las rutas para gestionar redes
router.post('/create-network', networkController.createNetwork);  // Ruta para crear redes
router.get('/networks', networkController.getAllNetworks);  // Ruta para obtener todas las redes
router.get('/networks/:id', networkController.getNetworkById);  // Ruta para obtener una red por id

export default router;
