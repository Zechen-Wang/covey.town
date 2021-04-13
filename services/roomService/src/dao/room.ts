import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;
const RoomSchema = new Schema({
  roomid: { type: String, required: true, index: true, unique: true },
  password: { type: String },
  roomname: { type: String },
  admins: { type: [String], default: undefined },
  creator: { type: String, required: true },
  blockers: { type: [String], default: undefined },
  isPublic: { type: Boolean },
  maxOccupancy: { type: Number },
});

export interface Room extends Document {
  roomid: string;
  passsword?: string;
  roomname: string;
  // admins?: Array<string>;
  admins: Array<string>;
  creator: string;
  blockers: Array<string>;
  isPublic: boolean;
  maxOccupancy: number;
}
// This model is mapping to MongoDB 'room' collection
export const RoomModel = model('Room', RoomSchema, 'room');

type CreateRoomRequest = {
  roomid: string,
  passsword: string,
  roomname: string,
  admins: string[],
  creator: string,
  blockers: string[],
  isPublic: boolean,
};

// export const createRoom = async (room_instance: Object): Promise<void> => RoomModel.create(room_instance);
export const createRoom = async (room_instance: CreateRoomRequest): Promise<void> => RoomModel.create(room_instance);

export const getRoomById = async (id: string): Promise<Room> => {
  const filter = { roomid: id };
  // return RoomModel.findOne(filter);
  const room: Room = await RoomModel.findOne(filter);
  return room;
};

export const listRooms = async (): Promise<Room[]> => {
  const rooms = await RoomModel.find();
  return rooms;
};

// export const updateRoomById = async (id: string, updated_info: Object): Promise<void> => {
//   const filter = { roomid: id };
//   return RoomModel.findOneAndUpdate(filter, updated_info);
// };

export const addAdminToRoom = async (roomid: string, admin: string): Promise<void> => {
  // getRoomById(roomid).then(room => {
  //   const { admins } = room;
  //   admins.push(admin);
  //   updateRoomById(roomid, room);
  // });

  const room = await getRoomById(roomid);
  const { admins } = room;
  admins.push(admin);
  const update = { admins };
  const filter = { roomid };
  await RoomModel.findOneAndUpdate(filter, update);

};

export const addBlockerToRoom = async (roomid: string, blocker: string): Promise<void> => {
  // getRoomById(roomid).then(room => {
  //   const { blockers } = room;
  //   blockers.push(blocker);
  //   updateRoomById(roomid, room);
  // });

  const room = await getRoomById(roomid);
  const { blockers } = room;
  blockers.push(blocker);
  const update = { blockers };
  const filter = { roomid };
  await RoomModel.findOneAndUpdate(filter, update);
};

export const removeAdminFromRoom = async (roomid: string, admin: string): Promise<void> => {
  // getRoomById(roomid).then(room => {
  //   const { admins } = room;
  //   const index = admins.indexOf(admin);
  //   if (index > -1) {
  //     admins.splice(index, 1);
  //     updateRoomById(roomid, room);
  //   }
  // });

  const room = await getRoomById(roomid);
  const { admins } = room;
  const index = admins.indexOf(admin);
  if (index > -1) {
    admins.splice(index, 1);
    // updateRoomById(roomid, room);
  }
  const update = { admins };
  // await updateRoomById(roomid, update);
  const filter = { roomid };
  await RoomModel.findOneAndUpdate(filter, update);
};

export const removeBlockerFromRoom = async (roomid: string, blocker: string): Promise<void> => {
  // getRoomById(roomid).then(room => {
  //   const { blockers } = room;
  //   const index = blockers.indexOf(blocker);
  //   if (index > -1) {
  //     blockers.splice(index, 1);
  //     updateRoomById(roomid, room);
  //   }
  // });

  const room = await getRoomById(roomid);
  const { blockers } = room;
  const index = blockers.indexOf(blocker);
  if (index > -1) {
    blockers.splice(index, 1);
  }
  const update = { blockers };
  // await updateRoomById(roomid, update);
  const filter = { roomid };
  await RoomModel.findOneAndUpdate(filter, update);
};

export const deleteRoomById = async (id: string): Promise<void> => RoomModel.deleteOne({ roomid: id });
