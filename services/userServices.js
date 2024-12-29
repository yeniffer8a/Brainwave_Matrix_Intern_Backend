import User from "../models/User.js";

export async function getUserBy(userId) {
  try {
    const user = await User.findOne({ _id: userId, deletedAt: { $eq: null } });
    return user;
  } catch (error) {
    throw new Error("Error al obtener el usuario: ", error);
  }
}
