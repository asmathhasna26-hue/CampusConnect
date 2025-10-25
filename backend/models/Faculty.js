import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: String,
  email: String,
  photo: String,
});

export default mongoose.model("Faculty", facultySchema);
