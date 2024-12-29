import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Mock de los datos del usuario
const mockUser = {
  _id: "userId",
  email: "mockuser@example.com",
  password: "Mock123*",
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const mockUserHash = {
  _id: "userId",
  email: "mockuser@example.com",
  password: "$2a$10$mockhashedpassword",
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock de los modelos de Mongoose
jest.unstable_mockModule("../models/User.js", () => {
  const findOne = jest.fn();
  const create = jest.fn();
  return {
    default: { findOne, create },
  };
});

// Mock de los servicios
jest.unstable_mockModule("../services/userServices.js", () => ({
  getUserBy: jest.fn(),
}));

// Importar los módulos después de los mocks
const { default: User } = await import("../models/User.js");
const { getUserBy } = await import("../services/userServices.js");
const userControllerModule = await import("../controllers/userController.js");
const userController = userControllerModule.default;

// Función mock para el objeto `req` (request) de Express
const mockReq = (data = {}) => ({
  body: { ...data },
  auth: { id: "userId" },
});

// Función mock para el objeto `res` (response) de Express
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller with Mocks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should log in the user if credentials are correct", async () => {
      const mockToken = "mockToken";
      User.findOne.mockResolvedValueOnce(mockUserHash);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue("mockToken");

      const req = mockReq({
        email: "mockuser@example.com",
        password: "Mock123*",
      });
      const res = mockRes();

      await userController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: req.body.email.toLowerCase(),
        deletedAt: { $eq: null },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUserHash.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { prueba: "123", id: mockUserHash.id },
        process.env.JWT_SECRET
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
    });

    it("should return an error if credentials are incorrect", async () => {
      User.findOne.mockResolvedValueOnce(mockUserHash);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      const req = mockReq({
        email: "mockuser@example.com",
        password: "wrongpassword",
      });
      const res = mockRes();

      await userController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: req.body.email.toLowerCase(),
        deletedAt: { $eq: null },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUserHash.password
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Passwords do not match",
      });
    });
    it("debería retornar 500 si hay un error del servidor", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));

      const req = mockReq({
        email: "mockuser@example.com",
        password: "password",
      });
      const res = mockRes();

      await userController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: req.body.email.toLowerCase(),
        deletedAt: { $eq: null },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
      });
    });
    it("should return an error if email is not provided", async () => {
      const req = mockReq({ password: "password" }); // Proveer solo el password
      const res = mockRes();
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You must be enter an email",
      });
    });
    it("should return an error if password is not provided", async () => {
      const req = mockReq({ email: "test@example.com" }); // Proveer solo el email
      const res = mockRes();
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You must be enter a password",
      });
    });
  });
  describe("onlyOneUser", () => {
    it("should return the user if found", async () => {
      getUserBy.mockResolvedValueOnce(mockUser);

      const req = mockReq();
      const res = mockRes();

      await userController.onlyOneUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 404 if user is not found", async () => {
      getUserBy.mockResolvedValueOnce(null);

      const req = mockReq();
      const res = mockRes();

      await userController.onlyOneUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return server error if an exception occurs", async () => {
      getUserBy.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await userController.onlyOneUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      getUserBy.mockResolvedValueOnce({ ...mockUser, save: saveMock });

      const req = mockReq();
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      getUserBy.mockResolvedValueOnce(null);

      const req = mockReq();
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return server error if an exception occurs", async () => {
      getUserBy.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq();
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(getUserBy).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
  describe("updateUser", () => {
    it("should update user data", async () => {
      const saveMock = jest.fn().mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue({ ...mockUser, save: saveMock });

      const req = mockReq({
        email: "newemail@example.com",
        password: "newpassword",
      });
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        "The user has been successfully updated"
      );
    });
    it("should return 404 if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      const req = mockReq({
        email: "newemail@example.com",
        password: "newpassword",
      });
      const res = mockRes();
      await userController.updateUser(req, res);
      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
    it("should return server error if an exception occurs", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));
      const req = mockReq({
        email: "newemail@example.com",
        password: "newpassword",
      });
      const res = mockRes();
      await userController.updateUser(req, res);
      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
  describe("createUser", () => {
    it("should create a new user when email is not found", async () => {
      User.findOne.mockResolvedValueOnce(null);
      User.create.mockResolvedValueOnce({
        email: "test@example.com",
        password: "password",
      });

      const req = mockReq({ email: "test@example.com", password: "password" });
      const res = mockRes();

      await userController.createUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(User.create).toHaveBeenCalledWith({
        email: "test@example.com".toLowerCase(),
        password: "password",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created" });
    });

    it("should return an error if user already exists", async () => {
      User.findOne.mockResolvedValueOnce(mockUser);

      const req = mockReq({
        email: "mockuser@example.com",
        password: "password",
      });
      const res = mockRes();

      await userController.createUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "mockuser@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "The user already exists",
      });
    });

    it("should return server error if an exception occurs", async () => {
      User.findOne.mockRejectedValueOnce(new Error("Server error"));

      const req = mockReq({ email: "test@example.com", password: "password" });
      const res = mockRes();

      await userController.createUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "User creation error: Server error",
      });
    });
  });
});
