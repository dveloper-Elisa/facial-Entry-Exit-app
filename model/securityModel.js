import mongoose from "mongoose";

const SecuritySchema = mongoose.Schema({
  name: { type: String, required: true },
  nid: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: "sec" },
  password: { type: String, required: true },
});

const Security = mongoose.model("Security", SecuritySchema);

export default Security;
