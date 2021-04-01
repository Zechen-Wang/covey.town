const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const UserSchema = new Schema({
  userName: {type: String, required: true, index: true, unique: true},
  password: {type: String, required: true},
  email: String,
  gender: String,
  age: String,
  city: String
});
// This model is mapping to MongoDB 'user' collection
export const UserModel = model('User', UserSchema, 'user');

export const createUser = async (user_instance: Object) => {
    return await UserModel.create(user_instance);
}

export const findUserByName = async (userName: String) => {
    const filter = { userName };
    return await UserModel.findOne(filter);
}

export const findUserByNameAndPassword = async (userName: String, password: string) => {
    const filter = {userName: userName, password: password}
    return await UserModel.findOne(filter);
}

export const updateUserByName = async (name: String, updated_info: Object) => {
    const filter = { userName: name };
    return UserModel.findOneAndUpdate(filter, updated_info);
}

export const deleteUserByName = async (name: String) => {
    return UserModel.deleteOne({userName: name});
}
// Example:
// const user_instance = { userName: 'TestUser', password: 'passw0rd' };
// createUser(user_instance); # Insert User into db
// updateUserByName('TestUser', {gender: 'female'}); # Update user information

