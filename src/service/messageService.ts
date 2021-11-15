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
 *  @route POST api/v1/message/:roomID
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

/**
 *  @쪽지함_조회
 *  @route GET api/v1/message/:messageRoomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 */

const GETmessageRoomService = async (userID: number, messageRoomID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !messageRoomID) return -1;

  const user = await User.findOne({ where: { userID, isDeleted: false } });
  // 2. 권한이 없는 user
  if (!user.certificated) return -2;

  const messageRoom = await MessageRoom.findOne({
    where: { messageRoomID },
    include: [
      {
        model: Room,
        attributes: ["roomID", "createdAt", "uploader"],
        include: [
          { model: RoomType, attributes: ["roomType", "category", "rentType"] },
          { model: RoomPrice, attributes: ["monthly", "deposit"] },
          { model: RoomPeriod, attributes: ["startDate", "endDate"] },
          { model: RoomInformation, attributes: ["area", "floor"] },
          { model: RoomPhoto, attributes: ["main"] },
        ],
      },
      {
        model: Message,
        attributes: ["sender", "content"],
        order: [["createdAt", "DESC"]],
      },
      {
        model: Participant,
        attributes: ["userID"],
      },
    ],
  });

  const participants = messageRoom.participants;
  let opponentID, myID;
  const opponent = participants.map((participant) => {
    if (participant.userID !== userID) {
      opponentID = participant.userID;
    } else {
      myID = participant.userID;
    }
  });

  if (myID !== userID) return -2;
  const rawMessages = messageRoom.messages;

  const messages = rawMessages.map((message) => {
    let messageType = "받은 쪽지";
    if (message.sender === userID) {
      messageType = "보낸 쪽지";
    }
    return { messageType, senderID: message.sender, content: message.content };
  });

  const resData = { opponentID, room: messageRoom.room, messages };

  return resData;
};

/**
 *  @쪽지_알림_조회
 *  @route GET api/v1/message
 *  @access private
 *  @error
 *    1. 권한이 없는 user
 */

const GETmessageService = async (userID: number) => {
  const user = await User.findOne({ where: { userID, isDeleted: false } });
  // 1. 권한이 없는 user
  if (!user.certificated) return -1;

  const messageRooms = await Participant.findAll({
    where: { userID },
    include: [
      {
        model: MessageRoom,
        include: [
          {
            model: Participant,
            include: [
              {
                model: User,
                as: "sender",
                where: { isDeleted: false },
                attributes: ["userID", "nickname"],
              },
            ],
          },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  let messages = [];
  messageRooms.map((messageRoom) => {
    const participants = messageRoom.messageRoom.participants;
    participants.map((participant) => {
      if (participant.userID !== userID) {
        messages.push({
          messageRoomID: participant.messageRoomID,
          nickname: participant.sender.nickname,
        });
      }
    });
  });

  const resData = { messages };

  return resData;
};

const messageService = {
  POSTmessageService,
  GETmessageRoomService,
  GETmessageService,
};

export default messageService;
