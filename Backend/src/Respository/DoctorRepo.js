import express from "express";

import uploadCloudinary from "../utils/cloudinary.js";
import Doctor from "../Model/Doctor.js";
import mongoose from "mongoose";
import { upload } from "../middleware/multer.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Patient from "../Model/Pateint.js";

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

doctorRouter.get("/getAll",async(req,res)=>{
  try{
     const user=await Doctor.find({})
     res.status(200).json(new ApiResponse(200,user,"all user displayed sucess fully"))
  }catch(error){
   throw new ApiError(404,"no user found")
  }
})

doctorRouter.get('/getDoctorAndPatients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId format using mongoose.Types.ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid doctor ID format"));
    }

    // Fetch the doctor details (only the name field)
    const doctor = await Doctor.findById(id)
    if (!doctor) {
      return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));
    }

    // Fetch all patients assigned to this doctor (only the name field)
    const patients = await Patient.find({ doctor: id })
      .select('name') // Fetch only the patient names
      .exec();

    // Format and send the response
    res.status(200).json(new ApiResponse(200, {
      doctorName: doctor.name, // Doctor's name
      patients: patients.map(patient => patient.name) // Array of patient names
    }, "Doctor and assigned patients retrieved successfully"));

  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Error retrieving doctor and patients"));
  }
});