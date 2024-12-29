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

    it("should return server error if an exception occurs", async () => {
      saveTask.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq({
        title: "Test Task",
        description: "Test Description",
        completed: false,
      });
      const res = mockRes();

      await taskController.createTask(req, res);

      expect(saveTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getOneTask", () => {
    it("should return a task by ID", async () => {
      const mockTask = {
        _id: "taskId",
        title: "Test Task",
        description: "Test Description",
        completed: false,
      };
      getUserBy.mockResolvedValueOnce(mockTask);

      const req = mockReq();
      const res = mockRes();

      await taskController.getOneTask(req, res);

      expect(getUserBy).toHaveBeenCalledWith("taskId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it("should return server error if an exception occurs", async () => {
      getUserBy.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await taskController.getOneTask(req, res);

      expect(getUserBy).toHaveBeenCalledWith("taskId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("listTasks", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        {
          _id: "taskId",
          title: "Test Task",
          description: "Test Description",
          completed: false,
        },
      ];
      getAll.mockResolvedValueOnce(mockTasks);

      const req = mockReq();
      const res = mockRes();

      await taskController.listTasks(req, res);

      expect(getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks });
    });

    it("should return server error if an exception occurs", async () => {
      getAll.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await taskController.listTasks(req, res);

      expect(getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteOneTask", () => {
    it("should delete a task", async () => {
      const saveMock = jest.fn();
      const mockTask = {
        _id: "taskId",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        save: saveMock,
      };
      getUserBy.mockResolvedValueOnce(mockTask);

      const req = mockReq();
      const res = mockRes();

      await taskController.deleteOneTask(req, res);

      expect(getUserBy).toHaveBeenCalledWith("taskId");
      expect(mockTask.deletedAt).not.toBeNull();
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task not found", async () => {
      getUserBy.mockResolvedValueOnce(null);

      const req = mockReq();
      const res = mockRes();

      await taskController.deleteOneTask(req, res);

      expect(getUserBy).toHaveBeenCalledWith("taskId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return server error if an exception occurs", async () => {
      getUserBy.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await taskController.deleteOneTask(req, res);

      expect(getUserBy).toHaveBeenCalledWith("taskId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getAllTaskDeleted", () => {
    it("should return all deleted tasks", async () => {
      const mockDeletedTasks = [mockTask];
      deleteUserBy.mockResolvedValueOnce(mockDeletedTasks);
      const req = mockReq();
      const res = mockRes();
      await taskController.getAllTaskDeleted(req, res);
      expect(deleteUserBy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tasks: mockDeletedTasks });
    });
    it("should return a message if no tasks are found", async () => {
      deleteUserBy.mockResolvedValueOnce([]);

      const req = mockReq();
      const res = mockRes();

      await taskController.getAllTaskDeleted(req, res);

      expect(deleteUserBy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "No task created" });
    });

    it("should return server error if an exception occurs", async () => {
      deleteUserBy.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await taskController.getAllTaskDeleted(req, res);

      expect(deleteUserBy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      Task.findOne.mockResolvedValueOnce(mockTask);
      const req = mockReq(
        {
          title: "Updated Task",
          description: "Updated description",
          completed: true,
        },
        { id: "taskId" }
      );
      const res = mockRes();
      await taskController.updateTask(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        deletedAt: { $eq: null },
      });
      expect(mockTask.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        "The task has been successfully updated"
      );
    });
    it("should return a message if no task information is provided", async () => {
      Task.findOne.mockResolvedValueOnce(null);
      const req = mockReq({}, { id: "taskId" });
      const res = mockRes();
      await taskController.updateTask(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        deletedAt: { $eq: null },
      });
      expect(res.json).toHaveBeenCalledWith("Did not enter any information");
    });

    it("should return server error if an exception occurs", async () => {
      const error = new Error("Server error");
      Task.findOne.mockRejectedValueOnce(error);
      const req = mockReq(
        {
          title: "Updated Task",
          description: "Updated description",
          completed: true,
        },
        { id: "taskId" }
      );
      const res = mockRes();
      await taskController.updateTask(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        deletedAt: { $eq: null },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
