import bcrypt from "bcryptjs";
import { Timestamp } from "bson";
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
