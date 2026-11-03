import express from "express";

import { errorHandler, notFoundHandler } from "./shared/httpErrorHandlers";

const app = express();

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Aquí se ensamblan y montan los módulos (repositorio -> servicio -> rutas)

// Si ninguna ruta coincidió: 404 en JSON
app.use(notFoundHandler);

// El manejador de errores va SIEMPRE al final
app.use(errorHandler);

export default app;
