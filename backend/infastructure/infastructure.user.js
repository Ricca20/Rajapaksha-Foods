import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Id: { type: String, required: true, unique: true }, 
  name: { type: String },
  email: { type: String, required: true, unique: true },
  address: { type: String }
});

const User = mongoose.model("User", userSchema);

export default User;
