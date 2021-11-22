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
 *  @내방_보기
 *  @route GET api/v1/user/room
 *  @access private
 *  @error
 */
const GETmyRoomService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    const rawRooms = yield models_1.Room.findAll({
        order: [["createdAt", "DESC"]],
        where: { isDeleted: false, university, uploader: userID },
        include: [
            {
                model: models_1.User,
                where: { isDeleted: false },
                attributes: [],
                required: true,
            },
            { model: models_1.RoomType, attributes: ["roomType", "category", "rentType"] },
            { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
            { model: models_1.RoomInformation, attributes: ["area", "floor"] },
            { model: models_1.RoomPhoto, attributes: ["main"] },
            { model: models_1.Like, where: { userID, isLike: true }, required: false },
        ],
        attributes: ["roomID", "createdAt"],
    });
    const rooms = rawRooms.map((room) => {
        return {
            roomID: room.roomID,
            createdAt: library_1.date.dateToString(room.createdAt),
            type: room.type,
            price: room.price,
            rentPeriod: {
                startDate: library_1.date.dateToString(room.rentPeriod.startDate),
                endDate: library_1.date.dateToString(room.rentPeriod.endDate),
            },
            information: room.information,
            photo: room.photo,
            isLike: room.likes.length ? true : false,
        };
    });
    const totalRoomNum = yield models_1.Room.count({
        where: { isDeleted: false, university },
    });
    const resData = { rooms, totalRoomNum };
    return resData;
});
/**
 *  @프로필_조회
 *  @route GET api/v1/user
 *  @access private
 *  @error
 */
const GETprofileService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    const user = yield models_1.User.findOne({
        where: { userID, isDeleted: false },
        attributes: ["userID", "nickname", "email"],
    });
    if (!user)
        return -1;
    const rooms = yield models_1.Room.findAll({
        order: [["createdAt", "DESC"]],
        where: { isDeleted: false, university },
        include: [
            {
                model: models_1.User,
                where: { isDeleted: false },
                attributes: [],
                required: true,
            },
            { model: models_1.RoomType, attributes: ["roomType", "category", "rentType"] },
            { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
            { model: models_1.RoomInformation, attributes: ["area", "floor"] },
            { model: models_1.RoomPhoto, attributes: ["main"] },
            { model: models_1.Like, where: { userID, isLike: true }, required: true },
        ],
        attributes: ["roomID", "createdAt"],
    });
    const likeRooms = rooms.map((room) => {
        return {
            roomID: room.roomID,
            createdAt: library_1.date.dateToString(room.createdAt),
            type: room.type,
            price: room.price,
            rentPeriod: {
                startDate: library_1.date.dateToString(room.rentPeriod.startDate),
                endDate: library_1.date.dateToString(room.rentPeriod.endDate),
            },
            information: room.information,
            photo: room.photo,
            isLike: room.likes.length ? true : false,
        };
    });
    const resData = { user, likeRooms };
    return resData;
});
/**
 *  @프로필_수정
 *  @route PATCH api/v1/user
 *  @access private
 *  @error
 *      1. 요청 바디 부족
 *      2. 존재하지 않는 유저
 */
const PATCHuserService = (userID, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    if (!nickname)
        return -1;
    const user = yield models_1.User.findOne({
        where: { userID, isDeleted: false },
    });
    if (!user)
        return -2;
    yield models_1.User.update({ nickname }, { where: { userID } });
    return undefined;
});
const userService = {
    GETmyRoomService,
    GETprofileService,
    PATCHuserService,
};
exports.default = userService;
//# sourceMappingURL=userService.js.map