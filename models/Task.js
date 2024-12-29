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
