import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserBy } from "../services/userServices.js";

async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    const userCreated = await User.findOne({
      email: email,
    });

    const userExists = await User.findOne({
      email: email,
      deletedAt: { $ne: null },
    });

    console.log("exists -->", userExists);
    if (userExists) {
      const newUser = await User.create({
        email: email.toLowerCase(),
        password,
      });
      return res.status(201).json({ message: "Usuario creado" });
    }

    if (!userCreated) {
      const newUser = await User.create({
        email: email.toLowerCase(),
        password,
      });
      return res.status(201).json({ message: "Usuario creado" });
    }
    res.json({ message: "El usuario ya existe" });
  } catch (error) {
    return res.status(500).json({ message: error.error });
  }
}

async function login(req, res) {
  try {
    //    console.log(
    //       "email password-->",
    //       req.body.password,
    //       req.body.email.toLowerCase()
    //     );
    if (req.body.email === null) {
      return res.status(500).json({
        message: "Debe ingresar un email",
      });
    }
    if (req.body.password === null) {
      return res.status(500).json({
        message: "Debe ingresar un password",
      });
    }
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      deletedAt: { $eq: null },
    });
    console.log(user.password);
    if (user === null) {
      return res.status(500).json({
        message: "El email es incorrecto o el usuario no está creado",
      });
    }
    // if (user.password != req.body.email) {
    //   res.status(500).json({ message: "Las contraseñas no coinciden" });
    // }
    const matchPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //console.log("password-->", matchPassword);
    if (matchPassword) {
      const token = jwt.sign(
        { prueba: "123", id: user.id },
        process.env.JWT_SECRET
      );
      //console.log(token);
      return res.json({ token: token });
    }
    res.status(500).json({ message: "Las contraseñas no coinciden" });
  } catch (error) {
    throw new Error(`Error al loguear el usuario: ${error.message}`);
  }
}

async function onlyOneUser(req, res) {
  try {
    const userToken = req.auth.id;
    const user = await getUserBy(userToken);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.auth.id;
    const user = await getUserBy(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.deletedAt = new Date();
    console.log(user.deletedAt);
    await user.save();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export default {
  createUser,
  login,
  onlyOneUser,
  deleteUser,
};
