import express from "express"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Patient from "../Model/Pateint.js"
import Management from "../Model/Management.js"
import Doctor from "../Model/Doctor.js";
import mongoose from "mongoose"

export const mangemantRouter=express.Router()

mangemantRouter.post("/createManagement", async (req, res, next) => {
    try {
      const { patientId, doctorId, status, diagnosis, dischargeDate } = req.body;
  
      if (!patientId || !doctorId || !status || !diagnosis) {
        return next(new ApiError(400, "Missing required fields"));
      }
  
     
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return next(new ApiError(404, "Patient not found"));
      }
  
     
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
      }
  
      // Create a new management record
      const newManagement = new Management({
        patient: patientId,
        doctor: doctorId,
        status,
        diagnosis,
        dischargeDate,
      })
  
     
      const populatedManagement=await newManagement.save();
  
   
      
       
     
      res.status(201).json(new ApiResponse(201,populatedManagement, "Management record created successfully"));
    } catch (error) {
    
      next(error);
    }
  });
 
 mangemantRouter.get("/getAllManagement", async (req, res, next) => {
    try {
     
      const managementRecords = await Management.find()
        .populate('patient')  
        .populate('doctor');    
      
      if (!managementRecords || managementRecords.length === 0) {
        return next(new ApiError(404, "No management records found"));
      }
  
    
      res.status(200).json(new ApiResponse(200, managementRecords, "Management records retrieved successfully"));
    } catch (error) {
      
      next(error);
    }
  });

  mangemantRouter.get('/getPatientDetails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();

    
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid patient ID format"));
    }

 
    const patient = await Patient.findById(trimmedId).select('-__v -createdAt -updatedAt');
    if (!patient) {
      return res.status(404).json(new ApiResponse(404, null, "Patient not found"));
    }

    
    const managementRecords = await Management.find({ patient: trimmedId })
      .populate('doctor')
      .select('-patient') // Populate doctor information
      .exec()

  
    const  formattedRecords=managementRecords.map((record)=>{
       return{...record.toObject(),patientDetails:[patient]}
    })

    
    res.status(200).json(new ApiResponse(200,  formattedRecords, "Patient details retrieved successfully"));
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Unsuccessful attempt"));
  }
});

mangemantRouter.get('/getPatientsByDoctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;


 

    // Validate the doctor ID format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid doctor ID format"));
    }

    // Fetch the doctor details (including the name)
    const doctor = await Doctor.findById(doctorId).select('name');
    if (!doctor) {
      return res.status(404).json(new ApiResponse(404, null, "Doctor not found"));
    }

    // Fetch management records for the specific doctor and populate patient details
    const managementRecords = await Management.find({ doctor: doctorId })
      .populate({
        path: 'patient',
        select: 'firstName lastName', // Fetch only the necessary patient fields
      })
      .exec();

    if (managementRecords.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, "No patients found for this doctor"));
    }

    // Check if patient details are populated correctly
    const patients = managementRecords.map(record => {
      if (record.patient) {
        return {
          _id: record.patient._id,
          name: `${record.patient.firstName || 'No First Name'} ${record.patient.lastName || 'No Last Name'}`,
          diagnosis: record.diagnosis,
          status: record.status,
          admittedDate: record.admittedDate,
          dischargeDate: record.dischargeDate,
        };
      } else {
        console.warn(`Patient record with ID ${record.patient} not found.`);
        return null; // Skip this record
      }
    }).filter(patient => patient !== null); // Filter out any null values

    // Respond with the doctor and patient details
    res.status(200).json(new ApiResponse(200, {
      doctorName: doctor.name, // Include doctor’s name at the top
      patients, // Array of patient details
    }, "Patients retrieved successfully"));

  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Error retrieving patients"));
  }
});








  
  
 