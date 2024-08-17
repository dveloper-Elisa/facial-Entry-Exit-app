import mongoose from "mongoose";

const { model, Schema } = mongoose;
const CheckinSchema = new Schema({
  regNumber: { type: String, required: true },
  materials: { type: Object, required: true },
});

const Checkin = model("Checkin", CheckinSchema);

export default Checkin;
