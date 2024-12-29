import Task from "../models/Task.js";

export async function saveTask(bodyContent) {
  console.log("bodyContent--->", bodyContent);
  try {
    const { title, description, completed } = bodyContent;

    const newTask = await Task.create({
      title,
      description,
      completed,
    });
    console.log("newTask-->", newTask);
    return newTask;
  } catch (error) {
    throw new Error("Error al obtener el usuario: ", error);
  }
}

export async function getAll() {
  try {
    const tasks = await Task.find({ deletedAt: { $eq: null } });
    return tasks;
  } catch (error) {
    //Lanzar el error para capturarlo en el controlador
    throw new Error("Error al obtener los usuarios: ", error);
  }
}

export async function getUserBy(taskId) {
  try {
    const task = await Task.findOne({ _id: taskId, deletedAt: { $eq: null } });
    return task;
  } catch (error) {
    throw new Error("Error al obtener el usuario: ", error);
  }
}

export async function deleteUserBy() {
  try {
    const tasks = await Task.find({ deletedAt: { $ne: null } });
    console.log(task);
    return tasks;
  } catch (error) {
    throw new Error("Error al obtener el usuario: ", error);
  }
}
