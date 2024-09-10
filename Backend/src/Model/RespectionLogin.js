import mongoose from "mongoose";

const Login = new mongoose.Schema({
  email: {
    type: string,
    required: true,
  },
  password: {
    type: string,
    required: true,
  },
});

const ReceptionLogin = mongoose.model("ReceptionLogin", Login);

export default ReceptionLogin;
