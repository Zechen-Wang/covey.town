import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema = new Schema({
  userName: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  email: String,
  gender: String,
  age: String,
  city: String,
});
// This model is mapping to MongoDB 'user' collection
export const UserModel = model('User', UserSchema, 'user');

export const createUser = async (user_instance: Object) => UserModel.create(user_instance);

export const findUserByName = async (userName: string) => {
  const filter = { userName };
  return UserModel.findOne(filter);
};

export const findUserByNameAndPassword = async (userName: string, password: string) => {
  const filter = { userName, password };
  return UserModel.findOne(filter);
};

export const updateUserByName = async (userName: string, updated_info: Object) => {
  const filter = { userName };
  return UserModel.findOneAndUpdate(filter, updated_info);
};

export const deleteUserByName = async (name: string) => {
  return UserModel.deleteOne({ userName: name });
};
// Example:
// const user_instance = { userName: 'TestUser', password: 'passw0rd' };
// createUser(user_instance); # Insert User into db
// updateUserByName('TestUser', {gender: 'female'}); # Update user information

export const countUsers = async (userName: string) => {
  const filter = { userName };
  return UserModel.countDocuments(filter);
};