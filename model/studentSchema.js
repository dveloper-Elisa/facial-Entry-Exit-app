import mongoose from "mongoose";

/**
 * Here we are creating module for registering student
 */

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  nid: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  regNumber: { type: String, require: true },
  password: { type: String, required: true },
  faceFeatures: { type: String, required: true }, // This can be image data or face descriptors
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
