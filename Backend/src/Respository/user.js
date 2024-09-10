import express from "express";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Reception from "../Model/Reception.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || password) {
      new ApiError(404, "all field are required");
    }
    // check user
    const existingUser = Reception.find({ $or: [{ username }, { email }] });
    if (existingUser) {
      new ApiError(409, "user already exist");
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = Reception.create({
      username,
      email,
      password: hashPassword,
    });
    const createdUser = await Reception.findById(user._id).select("-password");

    res
      .status(200)
      .json(new ApiResponse(200, createdUser, "sucessfully register"));
  } catch (error) {
    // Handle unexpected errors
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await Reception.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "invalid username or emial");
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = jwt.sign(
        { _id: user._id, email: user.email, username: user.username },
        process.env.jwt,
        { expiresIn: "1d" }
      );

      return res
        .status(200)
        .cookie("jwtToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json(
          new ApiResponse(
            200,
            { _id: user._id, username: user.username },
            "sucesfully login"
          )
        );
    }
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

userRouter.post("/reset-password/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await Reception.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid old password");
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save({ validateBeforeSave: false });

    // Send success response
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});
