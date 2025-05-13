import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  gender: String,
  jobTitle: String,
  skills: [String],
  country: String,
  state: String,
  city: String
});

const User = mongoose.model('User', userSchema);

export default User;
