import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: { type: String, unique: true },
  otp: String,
  otpExpiry: Date,
  googleId: String,
});

export default mongoose.models.User || mongoose.model('User', userSchema);