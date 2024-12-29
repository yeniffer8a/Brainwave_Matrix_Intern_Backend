# technical-test

## Descripción

La API technical tiene endpoints para realizar CRUD de usuarios y tareas. Tiene middlewares para validar el ingreso correcto de datos al crear y actualizar usuarios y tareas. Adicionalmente, tiene un endpoint para iniciar sesión con autenticación que genera un token con la librería de JWT y es validado en los endpoints con el middleware express-jwt. La contraseña es hasheada y validada con la librería bcryptjs.

## Instalación

Clona el repositorio y navega al directorio del proyecto:

````bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
Instala las dependencias necesarias:

npm install
Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

APP_PORT=
DB_CONNECTION_STRING=
DB_CONNECTION_STRING_ATLAS=
JWT_SECRET=

Uso
Para iniciar el servidor de desarrollo, usa:

npm run dev
La API estará disponible en technical-test-production-e516.up.railway.app Puedes acceder a la documentación de la API en http://localhost:3000/api-docs.
Pruebas
Para ejecutar las pruebas, utiliza:

npm test
Para ver el reporte de cobertura de código, utiliza:
npm run coverage
Contribución
Las contribuciones son bienvenidas. Para contribuir, sigue estos pasos:
1.	Haz un fork del repositorio.
2.	Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
3.	Realiza tus cambios y haz commit (git commit -m 'Añadir nueva característica').
4.	Empuja tu rama (git push origin feature/nueva-caracteristica).
5.	Abre un pull request.
Asegúrate de que tu código sigue nuestras guías de estilo y pasa todos los tests.
Contacto
Para preguntas o comentarios, puedes contactarme en yenifferdesarrollofullstack09@gmail.com
## Rutas Disponibles

### Rutas de Usuarios

1. **Crear Usuario**
   - **Ruta**: `/api/users`
   - **Método**: `POST`
   - **Descripción**: Permite registrar un nuevo usuario.
   - **Parámetros**:
     - `email`: string, requerido
     - `password`: string, requerido
   - **Respuesta**:
     - **Éxito**: `{ "message": "User created" }`
     - **Error**: `{ "error": "Error en el registro" }`
   - **Middleware**: `userValidator.create`, `userController.createUser`

2. **Obtener un Usuario**
   - **Ruta**: `/api/users`
   - **Método**: `GET`
   - **Descripción**: Permite obtener la información de un usuario.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Respuesta**:
     - **Éxito**: `{ "user": {...} }`
     - **Error**: `{ "error": "Acceso denegado" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `userController.onlyOneUser`

3. **Eliminar Usuario**
   - **Ruta**: `/api/users`
   - **Método**: `DELETE`
   - **Descripción**: Permite eliminar un usuario.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Respuesta**:
     - **Éxito**: `{ "message": "User deleted successfully" }`
     - **Error**: `{ "error": "Acceso denegado" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `userController.deleteUser`

4. **Actualizar Usuario**
   - **Ruta**: `/api/users`
   - **Método**: `PATCH`
   - **Descripción**: Permite actualizar la información de un usuario.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Parámetros**:
     - `email`: string, opcional
     - `password`: string, opcional
   - **Respuesta**:
     - **Éxito**: `{ "message": "The user has been successfully updated" }`
     - **Error**: `{ "error": "Acceso denegado" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `userController.updateUser`
### Rutas de Tareas

1. **Crear Tarea**
   - **Ruta**: `/api/tasks`
   - **Método**: `POST`
   - **Descripción**: Permite crear una nueva tarea.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Parámetros**:
     - `title`: string, requerido
     - `description`: string, opcional
   - **Respuesta**:
     - **Éxito**: `{ "message": "Task created", "task": {...} }`
     - **Error**: `{ "error": "Error al crear la tarea" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `taskValidator.create`, `taskController.createTask`

2. **Listar Tareas**
   - **Ruta**: `/api/tasks`
   - **Método**: `GET`
   - **Descripción**: Permite listar todas las tareas.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Respuesta**:
     - **Éxito**: `{ "tasks": [...] }`
     - **Error**: `{ "error": "Acceso denegado" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `taskController.listTasks`

3. **Obtener una Tarea por ID**
   - **Ruta**: `/api/tasks/:id`
   - **Método**: `GET`
   - **Descripción**: Permite obtener los detalles de una tarea específica por ID.
   - **Autorización**: Requiere un token JWT válido en el header de autorización.
   - **Respuesta**:
     - **Éxito**: `{ "task": {...} }`
     - **Error**: `{ "error": "Tarea no encontrada" }`
   - **Middleware**: `expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })`, `taskController.getOneTask`

4. **Actualizar Tarea**
   - **Ruta**: `/api/tasks/:id`
   - **Método**: `PATCH`
   - **Descripción**: Permite actualizar los detalles de una tarea específica por ID.
   - **Autorización**: Requiere un token JWT válido en el header de autorización
### Ruta de Autenticación

1. **Obtener Token**
   - **Ruta**: `/api/token`
   - **Método**: `POST`
   - **Descripción**: Permite obtener un token JWT para autenticación.
   - **Parámetros**:
     - `email`: string, requerido
     - `password`: string, requerido
   - **Respuesta**:
     - **Éxito**: `{ "token": "JWT token" }`
     - **Error**: `{ "error": "Credenciales inválidas" }`
   - **Middleware**: `userController.login`

### Autenticación y Autorización
Utiliza `express-jwt` para manejar la autenticación de las rutas protegidas. Se debe incluir el token JWT en el header de autorización para acceder a estas rutas.

### Validación de Datos
Utiliza `express-validator` para asegurar que los datos enviados al registrar un nuevo usuario y al iniciar sesión cumplan con los requisitos esperados.

### Conexión con Base de Datos

#### Instalación de Dependencias
Asegúrate de tener instaladas las dependencias necesarias:
```bash
npm install mongoose dotenv
Configuración de Variables de Entorno
Crea un archivo .env en la raíz de tu proyecto y añade las siguientes variables:


APP_PORT=
DB_CONNECTION_STRING=
DB_CONNECTION_STRING_ATLAS=
JWT_SECRET=
Función de Conexión
Crea un archivo database.js en el directorio config para gestionar la conexión a la base de datos:

import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect(
      process.env.DB_CONNECTION_STRING_ATLAS
    );
    console.log("Connection to the database has been established");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;
Importar y Conectar en el Servidor
Asegúrate de importar y llamar a la función de conexión en tu archivo server.js:


import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import apiRouter from "./routes/api.router.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./openapi.yaml");

const app = express();
const PORT = process.env.APP_PORT || "3001";

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("", apiRouter);

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
});

export default app;
Ejemplos de Operaciones CRUD
Modelo de Tarea (Task)
Crea un modelo para las tareas utilizando Mongoose:

import { Schema, model } from "mongoose";

const taskSchema = Schema(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, required: true, default: false },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);
export default Task;
Modelo de Usuario (User)
Crea un modelo para los usuarios utilizando Mongoose y bcrypt para encriptar las contraseñas:

import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = model("User", userSchema);
export default User;
### Funciones CRUD

#### Crear una Tarea
```javascript
async function createTask(req, res) {
  try {
    const task = await saveTask(req.body);
    return res.status(201).json({ message: "Task created", task: task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
Obtener una Tarea por ID
async function getOneTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = await getUserBy(taskId);
    res.status(200).json({ task: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
Listar Todas las Tareas
async function listTasks(req, res) {
  try {
    const tasks = await getAll();
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
Eliminar una Tarea
async function deleteOneTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = await getUserBy(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.deletedAt = new Date();
    await task.save();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
Actualizar una Tarea
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;
    const taskUpdate = await Task.findOne({
      _id: taskId,
      deletedAt: { $eq: null },
    });
    if (!taskUpdate) {
      return res.json("Did not enter any information");
    }
    taskUpdate.title = title || taskUpdate.title;
    taskUpdate.description = description || taskUpdate.description;
    taskUpdate.completed = completed;
    await taskUpdate.save();
    return res.status(200).json("The task has been successfully updated");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
Documentación y Pruebas
Utiliza swagger-ui-express para generar una documentación interactiva de las rutas. Ejemplo de configuración básica de Swagger:
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

### Pruebas Unitarias y de Integración

Realiza pruebas unitarias y de integración usando `jest` y `supertest`:

```javascript
import { jest } from "@jest/globals";

// Mock de los datos de la tarea
const mockTask = {
  _id: "taskId",
  title: "Sample Task",
  description: "This is a sample task",
  completed: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn(), // Definir save como una función de mock
};

// Mock de los servicios
jest.unstable_mockModule("../services/taskService.js", () => ({
  saveTask: jest.fn(),
  getUserBy: jest.fn(),
  getAll: jest.fn(),
  deleteUserBy: jest.fn(),
}));

// Mock de los modelos de Mongoose
jest.unstable_mockModule("../models/Task.js", () => {
  const findOne = jest.fn();
  const create = jest.fn();
  return {
    default: { findOne, create },
  };
});

// Importar los módulos después de los mocks
const { saveTask, getUserBy, getAll, deleteUserBy } = await import(
  "../services/taskService.js"
);
const { default: Task } = await import("../models/Task.js");
const taskControllerModule = await import("../controllers/taskController.js");
const taskController = taskControllerModule.default;

// Función mock para el objeto `req` (request) de Express
const mockReq = (data = {}) => ({
  body: { ...data },
  params: { id: "taskId" },
});

// Función mock para el objeto `res` (response) de Express
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Task Controller with Mocks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const mockTask = {
        title: "Test Task",
        description: "Test Description",
        completed: false,
      };
      saveTask.mockResolvedValueOnce(mockTask);

      const req = mockReq({
        title: "Test Task",
        description: "Test Description",
        completed: false,
      });
      const res = mockRes();

      await taskController.createTask(req, res);

      expect(saveTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task created",
        task: mockTask,
      });
    });
  });
});
## Configuraciones y Entornos

### Paso 1: Instalación de `dotenv`
Primero, asegúrate de tener instalada la dependencia `dotenv` en tu proyecto. Puedes instalarla usando npm:
```bash
npm install dotenv
Paso 2: Configuración del Archivo .env
Crea un archivo .env en la raíz de tu proyecto y añade las variables de entorno que proporcionaste:

APP_PORT=
DB_CONNECTION_STRING=
DB_CONNECTION_STRING_ATLAS=
JWT_SECRET=
Paso 3: Uso de dotenv en tu Aplicación
Ahora, importa y configura dotenv al inicio de tu aplicación para cargar las variables de entorno. Esto generalmente se hace en el archivo server.js o en un archivo de configuración separado:

Ejemplo en server.js:
import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import apiRouter from "./routes/api.router.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./openapi.yaml");

const app = express();
const PORT = process.env.APP_PORT || "3001";

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("", apiRouter);

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
});

export default app;
Ejemplo en config/database.js:
import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING_ATLAS);
    console.log("Connection to the database has been established");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;
Explicación de las Variables de Entorno
APP_PORT: Define el puerto en el que tu aplicación Express se ejecutará. Usualmente, es 3000 o cualquier otro puerto disponible.

DB_CONNECTION_STRING: Es la URI de conexión a tu base de datos local MongoDB. Se utiliza principalmente para desarrollo local.

DB_CONNECTION_STRING_ATLAS: Es la URI de conexión a tu base de datos MongoDB Atlas (nube). Se utiliza para despliegue en producción.

JWT_SECRET: Es una cadena secreta utilizada para firmar y verificar tokens JWT (JSON Web Tokens) para autenticación y autorización.

Seguridad en la API
Asegurar las Rutas
Para asegurar las rutas de tu API, has implementado express-jwt para manejar la autenticación basada en tokens JWT (JSON Web Tokens). Aquí está cómo funciona:

Middleware de Autenticación con JWT
Cada vez que una solicitud llega a una ruta protegida, el middleware de express-jwt verifica si el token JWT proporcionado en el header de autorización es válido.

import { expressjwt } from "express-jwt";
const jwtSecret = process.env.JWT_SECRET || "contraseniaSecreta!";

router.get(
  "/users",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  userController.onlyOneUser
);
Verificación del Token
Si el token es válido, la solicitud procede y el controlador correspondiente maneja la solicitud. Si el token no es válido o falta, se devuelve un error de autenticación.

router.use("/api", expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }));
Protección de Rutas
Todas las rutas críticas (e.g., creación, obtención, actualización, eliminación de usuarios y tareas) están protegidas por este middleware, asegurando que solo los usuarios autenticados puedan acceder a ellas.

router.get(
  "/tasks",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskController.listTasks
);
Encriptación de Contraseñas
Para proteger las contraseñas de los usuarios, has implementado bcryptjs para encriptar las contraseñas antes de guardarlas en la base de datos. Aquí está cómo funciona:

Pre-guardar Contraseñas encriptadas
Utilizas un hook de Mongoose (pre('save')) para encriptar la contraseña del usuario antes de que se guarde en la base de datos.
userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});
Comparación de Contraseñas
Al iniciar sesión, comparas la contraseña proporcionada por el usuario con la contraseña encriptada almacenada en la base de datos usando bcrypt.compare.
const matchPassword = await bcrypt.compare(
  req.body.password,
  user.password
);

if (matchPassword) {
  const token = jwt.sign(
    { prueba: "123", id: user.id },
    process.env.JWT_SECRET
  );
  return res.json({ token: token });
}
return res.status(401).json({ message: "Passwords do not match" });
Otras Medidas de Seguridad
Además de asegurar las rutas y encriptar contraseñas, también es importante considerar las siguientes medidas de seguridad:

Uso de HTTPS: Asegúrate de que tu API esté desplegada en un servidor que utilice HTTPS para cifrar el tráfico entre los clientes y el servidor.

Control de Acceso: Implementa un control de acceso adecuado para asegurarte de que los usuarios solo puedan acceder y modificar los recursos a los que tienen derecho.

Sanitización de Entrada: Usa bibliotecas como express-validator para validar y sanitizar los datos de entrada, protegiendo contra inyecciones de código y otros ataques.

import { body } from 'express-validator';

router.post("/users", [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], userController.createUser);
Gestión de Errores: Maneja adecuadamente los errores y no expongas detalles sensibles en los mensajes de error que devuelves a los usuarios.

````
