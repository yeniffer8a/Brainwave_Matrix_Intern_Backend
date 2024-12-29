import {
  deleteUserBy,
  getUserBy,
  saveTask,
  getAll,
} from "../services/taskService.js";

import Task from "../models/Task.js";
//technical-test-production-e516.up.railway.app/api/tasks ----railway

async function createTask(req, res) {
  try {
    const task = await saveTask(req.body);
    console.log("taskBody----->", task);
    return res.status(201).json({ message: "Task created", task: task });
  } catch (error) {
    return res.status(500).json({ message: error.error });
  }
}

async function getOneTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = await getUserBy(taskId);

    res.status(200).json({ task: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function listTasks(req, res) {
  try {
    const tasks = await getAll();
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteOneTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = await getUserBy(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.deletedAt = new Date();
    console.log(task.deletedAt);
    await task.save();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

async function getAllTaskDeleted(req, res) {
  try {
    const task = await deleteUserBy();
    if (task) {
      res.status(200).json({ task: task });
    } else {
      return res.json({ message: "No task created" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    console.log("taskID-->", taskId, "req.body-->", req.body);

    const { title, description, completed } = req.body;

    const taskUpdate = await Task.findOne({
      _id: taskId,
      deletedAt: { $eq: null },
    });
    console.log("update-->", taskUpdate);
    if (!taskUpdate) {
      return res.json("Did not enter any information");
    }

    taskUpdate.title = title || taskUpdate.title;
    taskUpdate.description = description || taskUpdate.description;
    taskUpdate.completed = completed || taskUpdate.completed;

    await taskUpdate.save();
    console.log("TSK-->", taskUpdate);
    return res.status(201).json("The task has been successfully updated");
  } catch (error) {
    return res.status(500).json({ message: error.error });
  }
}

export default {
  getOneTask,
  listTasks,
  deleteOneTask,
  getAllTaskDeleted,
  createTask,
  updateTask,
};
