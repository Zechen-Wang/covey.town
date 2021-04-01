import { Mongoose, Document } from 'mongoose';
const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const RoomUserSchema = new Schema({
  roomid: {type: String, required: true, index: true},
  users: {type: [String], default: undefined},
});

export const RoomUserModel = model('RoomUser', RoomUserSchema, 'roomUser');

export const createRoomUser = async (roomUser_instance: Object) => {
    return await RoomUserModel.create(roomUser_instance);
}

export const getRoomUserById = async (id: String) => {
    const filter = { roomid: id };
    return await RoomUserModel.findOne(filter);
}

export const updateRoomById = async (id: String, updated_info: Object) => {
    const filter = { roomid: id };
    return RoomUserModel.findOneAndUpdate(filter, updated_info);
}

export const addUserToRoom = async (roomid: String, user: String) => {
    getRoomUserById(roomid).then((roomUser) => {
        let users = roomUser.users;
        users.push(user);
        updateRoomById(roomid, roomUser);
    });
}

export const removeUserFromRoom = async (roomid: String, user: String) => {
    getRoomUserById(roomid).then((roomUser) => {
        let users = roomUser.users;
        let index = users.indexOf(user);
        if (index > -1) {
            users.splice(index, 1);
            updateRoomById(roomid, roomUser);
        }
    });
}

export const deleteRoomUserById = async (id: String) => {
    return RoomUserModel.deleteOne({roomid: id});
}
