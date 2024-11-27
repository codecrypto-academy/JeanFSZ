import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"
import networkRoutes from "./networks/networkRoutes";

dotenv.config();

const app: Express = express();
app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Permitir esta URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Si necesitas enviar cookies o autenticación
  })
);

const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/api', networkRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
