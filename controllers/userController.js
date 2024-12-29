import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserBy } from "../services/userServices.js";
//technical-test-production-e516.up.railway.app/api/users ----railway
//technical-test-production-e516.up.railway.app/api/token ----railway

async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    const userCreated = await User.findOne({ email: email.toLowerCase() });

    // if (userCreated.deletedAt === null) {
    //   return res.status(409).json({ message: "The user already exists" });
    // }
    if (userCreated) {
      if (userCreated.deletedAt === null) {
        return res.status(409).json({ message: "The user already exists" });
      } else {
        // Si el usuario fue eliminado, recrearlo
        userCreated.deletedAt = null;
        userCreated.password = password;
        await userCreated.save();
        return res.status(201).json({ message: "User created" });
      }
    }
    const newUser = await User.create({ email: email.toLowerCase(), password });
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error during createUser:", error.message);
    return res
      .status(500)
      .json({ message: `User creation error: ${error.message}` });
  }
}

async function login(req, res) {
  try {
    //    console.log(
    //       "email password-->",
    //       req.body.password,
    //       req.body.email.toLowerCase()
    //     );
    if (!req.body.email) {
      return res.status(400).json({
        message: "You must be enter an email",
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        message: "You must be enter a password",
      });
    }
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      deletedAt: { $eq: null },
    });
    //console.log(user.password);
    if (!user) {
      return res.status(404).json({
        message: "The email is incorrect or the user isn´t created",
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
    return res.status(401).json({ message: "Passwords do not match" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
async function updateUser(req, res) {
  // console.log("Auth-->", req.auth);
  try {
    const userId = req.auth.id;
    const { email, password } = req.body;

    const userUpdate = await User.findOne({
      _id: userId,
      deletedAt: { $eq: null },
    });
    // console.log("update-->", userUpdate);
    if (!userUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    userUpdate.email = email || userUpdate.email;
    userUpdate.password = password || userUpdate.password;

    console.log("userUpdate-->", userUpdate);
    await userUpdate.save();
    return res.status(200).json("The user has been successfully updated");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  createUser,
  login,
  onlyOneUser,
  deleteUser,
  updateUser,
};
