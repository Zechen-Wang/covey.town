import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;
const RoomSchema = new Schema({
  roomid: { type: String, required: true, index: true, unique: true },
  password: { type: String },
  roomname: { type: String },
  admins: { type: [String], default: undefined },
  creator: { type: String, required: true },
  blockers: { type: [String], default: undefined },
});

export interface Room extends Document {
  roomid: string;
  passsword?: string;
  roomname?: string;
  admins?: Array<string>;
  creator: string;
  blockers: Array<string>;
}
// This model is mapping to MongoDB 'room' collection
export const RoomModel = model('Room', RoomSchema, 'room');

export const createRoom = async (room_instance: Object) => RoomModel.create(room_instance);

export const getRoomById = async (id: string) => {
  const filter = { roomid: id };
  return RoomModel.findOne(filter);
};

export const updateRoomById = async (id: string, updated_info: Object) => {
  const filter = { roomid: id };
  return RoomModel.findOneAndUpdate(filter, updated_info);
};

export const addAdminToRoom = async (roomid: string, admin: string) => {
  getRoomById(roomid).then(room => {
    const { admins } = room;
    admins.push(admin);
    updateRoomById(roomid, room);
  });
};

export const addBlockerToRoom = async (roomid: string, blocker: string) => {
  getRoomById(roomid).then(room => {
    const { blockers } = room;
    blockers.push(blocker);
    updateRoomById(roomid, room);
  });
};

export const removeAdminFromRoom = async (roomid: string, admin: string) => {
  getRoomById(roomid).then(room => {
    const { admins } = room;
    const index = admins.indexOf(admin);
    if (index > -1) {
      admins.splice(index, 1);
      updateRoomById(roomid, room);
    }
  });
};

export const removeBlockerFromRoom = async (roomid: string, blocker: string) => {
  getRoomById(roomid).then(room => {
    const { blockers } = room;
    const index = blockers.indexOf(blocker);
    if (index > -1) {
      blockers.splice(index, 1);
      updateRoomById(roomid, room);
    }
  });
};

export const deleteRoomById = async (id: string) => RoomModel.deleteOne({ roomid: id });
