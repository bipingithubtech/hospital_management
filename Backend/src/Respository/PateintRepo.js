import express from 'express'
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Patient from '../Model/Pateint.js';



export const PatientRouter=express.Router()


PatientRouter.post("/createPatient", async (req, res, next) => {
    try {
      const { firstName, lastName, dateOfBirth, gender, contactInfo } = req.body;
  
      // Check if any field is missing
      if (!firstName || !lastName || !dateOfBirth || !gender || !contactInfo ) {
        return next(new ApiError(404, "Fields are missing"));
      }
      const parsedDate = new Date(dateOfBirth);

      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        return next(new ApiError(400, "Invalid date format. Use 'YYYY-MM-DD'."));
      }
  
      // Format the date to 'YYYY-MM-DD'
      const formattedDate = parsedDate.toISOString().split('T')[0];
  
      const newUser = await Patient.create({
        firstName,
        lastName,
        dateOfBirth:formattedDate,
        gender,
        contactInfo,
      
        })

      
    
      if (!newUser) {
        throw new ApiError(500, "Unable to add");
      }
  
      res.status(200).json(new ApiResponse(200,  newUser, "Patient detail successfully added"));
    } catch (error) {
      next(error); // Pass any error to the global error handler
    }
  });
  
  PatientRouter.get("/all",async(req,res)=>{
    const allPatient=await Patient.find({}).populate("doctor")
    res.status(200).json(new ApiResponse(200,allPatient,"all patient diplayed"))
  })

  PatientRouter.delete("/:id",async(req,res)=>{
    const {id}=req.params
    const trimId=id.trim()
   await Patient.findByIdAndDelete(trimId)

    res.status(200).json(new ApiResponse(200,"user deleted sucessfully"))
  })

 PatientRouter.put("/update/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Find and update the patient by ID
      const updatedPatient = await Patient.findByIdAndUpdate(id.trim(), req.body, { new: true });
  
      if (!updatedPatient) {
        throw new ApiError(404, "Patient not found"); // Handle the case when no patient is found
      }
  
      // Respond with the updated patient data
      res.status(200).json(new ApiResponse(200, updatedPatient, "Updated successfully"));
    } catch (error) {
      next(new ApiError(500, error.message || "Error while updating")); // Pass the error to the error handler
    }
  });
  