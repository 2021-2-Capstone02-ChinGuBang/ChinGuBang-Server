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
 *  @방_내놓기
 *  @route Post /api/v1/room
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */
const POSTroomService = (userID, reqData, url) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, price, information, rentPeriod, options, conditions } = reqData;
    // 1. 요청 바디 부족
    if (!type || !information || !rentPeriod || !options || !conditions) {
        return -1;
    }
    const user = yield models_1.User.findOne({ where: { userID } });
    // 2. 유저 id 잘못됨
    if (!user) {
        return -2;
    }
    // 3. 유저 권한 없음
    const certification = yield models_1.Certification.findOne({ where: { userID } });
    if (!certification) {
        return -3;
    }
    // room 생성
    const newRoom = yield models_1.Room.create({
        uploader: userID,
        university: certification.university,
    });
    yield models_1.RoomType.create({
        roomID: newRoom.roomID,
        roomType: type.roomType,
        category: type.category,
        rentType: type.rentType,
    });
    yield models_1.RoomInformation.create({
        roomID: newRoom.roomID,
        area: library_1.cast.stringToNumber(information.area),
        floor: library_1.cast.stringToNumber(information.floor),
        construction: library_1.cast.stringToNumber(information.construction),
        address: information.address,
        description: information.description,
    });
    yield models_1.RoomPrice.create({
        roomID: newRoom.roomID,
        deposit: library_1.cast.stringToNumber(price.deposit),
        monthly: library_1.cast.stringToNumber(price.monthly),
        control: library_1.cast.stringToNumber(price.control),
    });
    yield models_1.RoomPeriod.create({
        roomID: newRoom.roomID,
        startDate: library_1.date.stringToDate(rentPeriod.startDate),
        endDate: library_1.date.stringToDate(rentPeriod.endDate),
    });
    yield models_1.RoomCondition.create({
        roomID: newRoom.roomID,
        gender: conditions.gender,
        smoking: library_1.cast.stringToBoolean(conditions.smoking),
    });
    yield models_1.RoomPhoto.create({
        roomID: newRoom.roomID,
        main: url.main,
        restroom: url.restroom,
        kitchen: url.kitchen,
        photo1: url.photo1,
        photo2: url.photo2,
        photo3: url.photo3,
    });
    yield models_1.RoomOption.create({
        roomID: newRoom.roomID,
        bed: library_1.cast.stringToBoolean(options.bed),
        table: library_1.cast.stringToBoolean(options.table),
        chair: library_1.cast.stringToBoolean(options.chair),
        closet: library_1.cast.stringToBoolean(options.closet),
        airconditioner: library_1.cast.stringToBoolean(options.airconditioner),
        induction: library_1.cast.stringToBoolean(options.induction),
        refrigerator: library_1.cast.stringToBoolean(options.refrigerator),
        tv: library_1.cast.stringToBoolean(options.tv),
        doorlock: library_1.cast.stringToBoolean(options.doorlock),
        microwave: library_1.cast.stringToBoolean(options.microwave),
        washingmachine: library_1.cast.stringToBoolean(options.washingmachine),
        cctv: library_1.cast.stringToBoolean(options.cctv),
        wifi: library_1.cast.stringToBoolean(options.wifi),
        parking: library_1.cast.stringToBoolean(options.parking),
        elevator: library_1.cast.stringToBoolean(options.elevator),
    });
    // table join
    const room = yield models_1.Room.findOne({
        where: {
            roomID: newRoom.roomID,
        },
        include: [
            {
                model: models_1.User,
                attributes: ["userID", "nickname"],
            },
            {
                model: models_1.RoomType,
                attributes: ["roomType", "category", "rentType"],
            },
            {
                model: models_1.RoomPrice,
                attributes: ["deposit", "monthly", "control"],
            },
            {
                model: models_1.RoomInformation,
                attributes: ["area", "floor", "construction", "address", "description"],
            },
            {
                model: models_1.RoomOption,
                attributes: [
                    "bed",
                    "table",
                    "chair",
                    "closet",
                    "airconditioner",
                    "induction",
                    "refrigerator",
                    "tv",
                    "doorlock",
                    "microwave",
                    "washingmashine",
                    "cctv",
                    "wifi",
                    "parking",
                    "elevator",
                ],
            },
            {
                model: models_1.RoomCondition,
                attributes: ["gender", "smoking"],
            },
            {
                model: models_1.RoomPhoto,
                attributes: [
                    "main",
                    "restroom",
                    "kitchen",
                    "photo1",
                    "photo2",
                    "photo3",
                ],
            },
        ],
        attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
    });
    const resData = room;
    // // data 형식에 맞게 변경
    // const resData: roomDTO.postRoomResDTO = {
    //   roomID: room.roomID,
    //   createdAt: room.createdAt,
    //   uploader: room.upl
    // };
    return resData;
});
/**
 *  @모든_방_보기
 *  @route GET api/v1/room?offset=@&limit=
 *  @access private
 *  @error
 *    1. no limit
 */
const GETallRoomService = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offset) {
        offset = 0;
    }
    // 1. No limit
    if (!limit) {
        return -1;
    }
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
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
            { model: models_1.RoomType, attributes: ["roomType", "category"] },
            { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
            { model: models_1.RoomInformation, attributes: ["area", "floor"] },
            { model: models_1.RoomPhoto, attributes: ["main"] },
            { model: models_1.Like, where: { userID }, required: false },
        ],
        attributes: ["roomID", "createdAt"],
        offset,
        limit,
    });
    const totalRoomNum = yield models_1.Room.count({
        where: { isDeleted: false, university },
    });
    const resData = { rooms, totalRoomNum };
    return resData;
});
const roomService = {
    POSTroomService,
    GETallRoomService,
};
exports.default = roomService;
//# sourceMappingURL=roomService.js.map