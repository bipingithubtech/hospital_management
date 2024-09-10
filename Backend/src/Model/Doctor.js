import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    Image: {
      type: String,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    pateintHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    registeredDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
