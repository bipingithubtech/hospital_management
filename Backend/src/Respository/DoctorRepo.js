import express from "express";

import uploadCloudinary from "../utils/cloudinary.js";
import Doctor from "../Model/Doctor.js";

import { upload } from "../middleware/multer.js";
import ApiResponse from "../utils/ApiResponse.js";

export const doctorRouter = express.Router();

// create doctor information
doctorRouter.post("/createDoctor", upload.single("image"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      contactInfo,
      specialization,
      experience,
      pateintHistory,
    } = req.body;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ message: "Image file not found" });
    }

    const image = await uploadCloudinary(imageLocalPath);
    console.log(image);
    const newDoctor = await Doctor.create({
      firstName,
      lastName,
      gender,
      contactInfo,
      Image: image.url,
      specialization,
      experience,
      pateintHistory,
    });

    res
      .status(200)
      .json(new ApiResponse(200, newDoctor, "doctor data secessfully added"));
  } catch (error) {
    res.status(500).json({ message: "Error creating doctor", error });
  }
});

doctorRouter.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();

    // Find the doctor by ID and update with request body
    const updatedDoctor = await Doctor.findByIdAndUpdate(trimmedId, req.body, {
      new: true,
    });

    if (!updatedDoctor) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Doctor not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedDoctor, "Doctor updated successfully"));
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json(new ApiResponse(500, null, "Error updating doctor"));
  }
});

doctorRouter.patch("/updateImage/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const trimId = id.trim();
    const localPath = req.file?.path;

    if (!localPath) {
      return res.status(400).json({ message: "Image file not found" });
    }

    const image = await uploadCloudinary(localPath);
    console.log("Cloudinary response:", image);

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      trimId,
      { $set: { Image: image.url } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));
    }

    return res.status(200).json(new ApiResponse(200, updatedDoctor, "Image updated successfully"));
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json(new ApiResponse(500, null, "Error updating image"));
  }
});

