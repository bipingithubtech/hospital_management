import mongoose from "mongoose";

const managementSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Under Treatment", "Recovered"],
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    admittedDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Management = mongoose.model("Management", managementSchema);

export default Management;
