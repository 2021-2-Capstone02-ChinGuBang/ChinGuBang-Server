// models
import {
  User,
  Certification,
  Room,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
  RoomType,
  RoomPeriod,
  RoomPrice,
  Like,
  MessageRoom,
  Message,
  Participant,
} from "../models";
// DTO
import { messageDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { date, cast } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @쪽지_보내기
 *  @route POST api/v1/message
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 *    4. 잘못된 수신인
 */

const POSTmessageService = async (
  userID: number,
  roomID: number,
  reqData: messageDTO.postMessageReqDTO
) => {
  const { receiverID, content } = reqData;
  // 1. 요청 바디 부족

  if (!userID || !roomID || !receiverID || !content) return -1;

  const sender = await User.findOne({ where: { userID, isDeleted: false } });

  // 2. 권한이 없는 user
  if (!sender.certificated) return -2;

  const room = await Room.findOne({ where: { roomID, isDeleted: false } });

  // 3. no room
  if (!room) return -3;

  const receiver = await User.findOne({
    where: { userID: receiverID, isDeleted: false },
  });

  // 4. 잘못된 수신인
  if (!receiver) return -4;

  let messageRoom = await MessageRoom.findOne({
    where: { roomID },
    include: [
      {
        model: Participant,
        where: { userID: receiverID },
        required: true,
        attributes: [],
      },
      {
        model: Participant,
        where: { userID },
        required: true,
        attributes: [],
      },
    ],
  });
  if (!messageRoom) {
    messageRoom = await MessageRoom.create({ roomID });
    await Participant.create({
      messageRoomID: messageRoom.messageRoomID,
      userID: userID,
    });
    await Participant.create({
      messageRoomID: messageRoom.messageRoomID,
      userID: receiverID,
    });
  } else {
    messageRoom.save();
  }

  const message = await Message.create({
    sender: userID,
    messageRoomID: messageRoom.messageRoomID,
    content,
  });

  const resData = {
    messageRoomID: messageRoom.messageRoomID,
    sender: userID,
    receiver: receiverID,
    content,
  };

  return resData;
};

const messageService = {
  POSTmessageService,
};

export default messageService;
