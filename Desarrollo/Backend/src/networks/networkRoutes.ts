import { Router } from 'express';
import { networkController } from './controllers/network.controller';

const router = Router();

// Definir las rutas para gestionar redes
router.post('/create-network', networkController.createNetwork);  // Ruta para crear redes
router.get('/networks', networkController.getAllNetworks);  // Ruta para obtener todas las redes
router.get('/networks/:id', networkController.getNetworkById);  // Ruta para obtener una red por id


// Rutas adicionales para operaciones de red
router.post('/networks/:id/up', networkController.upNetwork); // Levantar la red
router.post('/networks/:id/down', networkController.downNetwork); // Bajar la red
router.get('/networks/:id/status', networkController.getNetworkStatus); // Obtener el estado
router.get('/networks/up', networkController.getActiveNetworks); // Ruta para obtener redes levantadas

export default router;
