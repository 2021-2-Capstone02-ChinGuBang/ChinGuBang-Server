"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// models
const models_1 = require("../models");
const library_1 = require("../library");
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
const POSTmessageService = (userID, roomID, reqData) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverID, content } = reqData;
    // 1. 요청 바디 부족
    if (!userID || !roomID || !receiverID || !content)
        return -1;
    const sender = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 2. 권한이 없는 user
    if (!sender.certificated)
        return -2;
    const rawRoom = yield models_1.Room.findOne({
        where: { roomID, isDeleted: false },
        attributes: ["roomID", "createdAt", "uploader"],
        include: [
            { model: models_1.RoomType, attributes: ["roomType", "category", "rentType"] },
            { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
            { model: models_1.RoomInformation, attributes: ["area", "floor"] },
            { model: models_1.RoomPhoto, attributes: ["main"] },
        ],
    });
    // 3. no room
    if (!rawRoom)
        return -3;
    const receiver = yield models_1.User.findOne({
        where: { userID: receiverID, isDeleted: false },
    });
    // 4. 잘못된 수신인
    if (!receiver)
        return -4;
    let messageRoom = yield models_1.MessageRoom.findOne({
        where: { roomID },
        include: [
            {
                model: models_1.Participant,
                where: { userID: receiverID },
                required: true,
                attributes: [],
            },
            {
                model: models_1.Participant,
                where: { userID },
                required: true,
                attributes: [],
            },
        ],
    });
    if (!messageRoom) {
        messageRoom = yield models_1.MessageRoom.create({ roomID });
        yield models_1.Participant.create({
            messageRoomID: messageRoom.messageRoomID,
            userID: userID,
        });
        yield models_1.Participant.create({
            messageRoomID: messageRoom.messageRoomID,
            userID: receiverID,
        });
    }
    else {
        messageRoom.save();
    }
    yield models_1.Message.create({
        sender: userID,
        messageRoomID: messageRoom.messageRoomID,
        content,
    });
    const rawMessages = yield models_1.Message.findAll({
        where: { messageRoomID: messageRoom.messageRoomID },
        attributes: ["sender", "content"],
        order: [["createdAt", "DESC"]],
    });
    const messages = rawMessages.map((message) => {
        let messageType = "받은 쪽지";
        if (message.sender === userID) {
            messageType = "보낸 쪽지";
        }
        return { messageType, senderID: message.sender, content: message.content };
    });
    const room = {
        roomID: rawRoom.roomID,
        createdAt: library_1.date.dateToString(rawRoom.createdAt),
        uploader: rawRoom.uploader,
        type: rawRoom.type,
        price: rawRoom.price,
        rentPeriod: {
            startDate: library_1.date.dateToString(rawRoom.rentPeriod.startDate),
            endDate: library_1.date.dateToString(rawRoom.rentPeriod.endDate),
        },
        information: rawRoom.information,
        photo: rawRoom.photo,
    };
    const resData = {
        opponentID: receiverID,
        room,
        messages,
    };
    return resData;
});
/**
 *  @쪽지함_조회
 *  @route GET api/v1/message/:messageRoomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 */
const GETmessageRoomService = (userID, messageRoomID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !messageRoomID)
        return -1;
    const user = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 2. 권한이 없는 user
    if (!user.certificated)
        return -2;
    const messageRoom = yield models_1.MessageRoom.findOne({
        where: { messageRoomID },
        order: [["messages", "createdAt", "DESC"]],
        include: [
            {
                model: models_1.Room,
                attributes: ["roomID", "createdAt", "uploader"],
                include: [
                    { model: models_1.RoomType, attributes: ["roomType", "category", "rentType"] },
                    { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
                    { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
                    { model: models_1.RoomInformation, attributes: ["area", "floor"] },
                    { model: models_1.RoomPhoto, attributes: ["main"] },
                ],
            },
            {
                model: models_1.Message,
                attributes: ["sender", "content"],
                order: [["createdAt", "DESC"]],
            },
            {
                model: models_1.Participant,
                attributes: ["userID"],
            },
        ],
    });
    const participants = messageRoom.participants;
    let opponentID, myID;
    const opponent = participants.map((participant) => {
        if (participant.userID !== userID) {
            opponentID = participant.userID;
        }
        else {
            myID = participant.userID;
        }
    });
    if (myID !== userID)
        return -2;
    const messages = messageRoom.messages.map((message) => {
        let messageType = "받은 쪽지";
        if (message.sender === userID) {
            messageType = "보낸 쪽지";
        }
        return { messageType, senderID: message.sender, content: message.content };
    });
    const room = {
        roomID: messageRoom.room.roomID,
        createdAt: library_1.date.dateToString(messageRoom.room.createdAt),
        uploader: messageRoom.room.uploader,
        type: messageRoom.room.type,
        price: messageRoom.room.price,
        rentPeriod: {
            startDate: library_1.date.dateToString(messageRoom.room.rentPeriod.startDate),
            endDate: library_1.date.dateToString(messageRoom.room.rentPeriod.endDate),
        },
        information: messageRoom.room.information,
        photo: messageRoom.room.photo,
    };
    const resData = { opponentID, room, messages };
    return resData;
});
/**
 *  @쪽지_알림_조회
 *  @route GET api/v1/message
 *  @access private
 *  @error
 *    1. 권한이 없는 user
 */
const GETmessageService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 1. 권한이 없는 user
    if (!user.certificated)
        return -1;
    const messageRooms = yield models_1.Participant.findAll({
        where: { userID },
        include: [
            {
                model: models_1.MessageRoom,
                include: [
                    {
                        model: models_1.Participant,
                        include: [
                            {
                                model: models_1.User,
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
});
const messageService = {
    POSTmessageService,
    GETmessageRoomService,
    GETmessageService,
};
exports.default = messageService;
//# sourceMappingURL=messageService.js.map