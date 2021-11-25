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
const sequelize_1 = require("sequelize");
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
    if (!type ||
        !price ||
        !information ||
        !rentPeriod ||
        !options ||
        !conditions) {
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
        query: information.query,
        post: information.post,
        address: information.address,
        lat: information.lat,
        lng: information.lng,
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
        smoking: conditions.smoking,
    });
    yield models_1.RoomPhoto.create({
        roomID: newRoom.roomID,
        main: url.main,
        restroom: url.restroom,
        kitchen: url.kitchen,
        photo1: url.photo1,
        photo2: url.photo2,
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
                attributes: [
                    "area",
                    "floor",
                    "construction",
                    "query",
                    "post",
                    "address",
                    "lat",
                    "lng",
                    "description",
                ],
            },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
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
                    "microwave",
                    "washingmachine",
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
                attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
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
 *  @방_수정하기
 *  @route Post /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */
const PATCHroomService = (userID, roomID, reqData, url) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, price, information, rentPeriod, options, conditions } = reqData;
    // 1. 요청 바디 부족
    if (!type ||
        !price ||
        !information ||
        !rentPeriod ||
        !options ||
        !conditions) {
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
    const alreadyRoom = yield models_1.Room.findOne({
        where: { roomID, isDeleted: false },
    });
    if (alreadyRoom.uploader !== userID)
        return -3;
    yield models_1.RoomType.update({
        roomType: type.roomType,
        category: type.category,
        rentType: type.rentType,
    }, { where: { roomID } });
    yield models_1.RoomInformation.update({
        area: library_1.cast.stringToNumber(information.area),
        floor: library_1.cast.stringToNumber(information.floor),
        construction: library_1.cast.stringToNumber(information.construction),
        query: information.query,
        post: information.post,
        address: information.address,
        lat: information.lat,
        lng: information.lng,
        description: information.description,
    }, { where: { roomID } });
    yield models_1.RoomPrice.update({
        deposit: library_1.cast.stringToNumber(price.deposit),
        monthly: library_1.cast.stringToNumber(price.monthly),
        control: library_1.cast.stringToNumber(price.control),
    }, { where: { roomID } });
    yield models_1.RoomPeriod.update({
        startDate: library_1.date.stringToDate(rentPeriod.startDate),
        endDate: library_1.date.stringToDate(rentPeriod.endDate),
    }, { where: { roomID } });
    yield models_1.RoomCondition.update({
        gender: conditions.gender,
        smoking: conditions.smoking,
    }, { where: { roomID } });
    yield models_1.RoomPhoto.update({
        main: url.main,
        restroom: url.restroom,
        kitchen: url.kitchen,
        photo1: url.photo1,
        photo2: url.photo2,
    }, { where: { roomID } });
    yield models_1.RoomOption.update({
        bed: library_1.cast.stringToBoolean(options.bed),
        table: library_1.cast.stringToBoolean(options.table),
        chair: library_1.cast.stringToBoolean(options.chair),
        closet: library_1.cast.stringToBoolean(options.closet),
        airconditioner: library_1.cast.stringToBoolean(options.airconditioner),
        induction: library_1.cast.stringToBoolean(options.induction),
        refrigerator: library_1.cast.stringToBoolean(options.refrigerator),
        tv: library_1.cast.stringToBoolean(options.tv),
        microwave: library_1.cast.stringToBoolean(options.microwave),
        washingmachine: library_1.cast.stringToBoolean(options.washingmachine),
        cctv: library_1.cast.stringToBoolean(options.cctv),
        wifi: library_1.cast.stringToBoolean(options.wifi),
        parking: library_1.cast.stringToBoolean(options.parking),
        elevator: library_1.cast.stringToBoolean(options.elevator),
    }, { where: { roomID } });
    // table join
    const room = yield models_1.Room.findOne({
        where: { roomID },
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
                attributes: [
                    "area",
                    "floor",
                    "construction",
                    "query",
                    "post",
                    "address",
                    "lat",
                    "lng",
                    "description",
                ],
            },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
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
                    "microwave",
                    "washingmachine",
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
                attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
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
 *  @route GET api/v1/room
 *  @access private
 *  @error
 */
const GETallRoomService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    const rawRooms = yield models_1.Room.findAll({
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
 *  @방_보기_deail
 *  @route GET api/v1/room/:roomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. no user
 *    3. no room
 */
const GETroomDetailService = (userID, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !roomID)
        return -1;
    const user = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 2. no user
    if (!user)
        return -2;
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    // table join
    const rawRoom = yield models_1.Room.findOne({
        where: {
            roomID,
            isDeleted: false,
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
                attributes: [
                    "area",
                    "floor",
                    "construction",
                    "query",
                    "post",
                    "address",
                    "lat",
                    "lng",
                    "description",
                ],
            },
            {
                model: models_1.RoomPeriod,
                attributes: ["startDate", "endDate"],
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
                    "microwave",
                    "washingmachine",
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
                attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
            },
        ],
        attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
    });
    // 3. no room
    if (!rawRoom)
        return -3;
    const room = {
        roomID: rawRoom.roomID,
        user: rawRoom.user,
        type: rawRoom.type,
        price: rawRoom.price,
        information: rawRoom.information,
        rentPeriod: {
            startDate: library_1.date.dateToString(rawRoom.rentPeriod.startDate),
            endDate: library_1.date.dateToString(rawRoom.rentPeriod.endDate),
        },
        options: rawRoom.options,
        conditions: rawRoom.conditions,
        photo: rawRoom.photo,
    };
    const resData = room;
    return resData;
});
/**
 *  @필터링_방_보기
 *  @route POST api/v1/room/filter
 *  @access private
 *  @error
 */
const POSTroomFilterService = (userID, reqData) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, price, rentPeriod, options, conditions } = reqData;
    // type이 null이면
    if (!type.roomType || type.roomType.length === 0) {
        type.roomType = ["원룸", "투룸 이상", "오피스텔", "아파트"];
    }
    if (!type.category || type.category.length === 0) {
        type.category = ["단기임대", "양도"];
    }
    if (!type.rentType || type.rentType.length === 0) {
        type.rentType = ["월세", "전세"];
    }
    if (!rentPeriod.startDate) {
        rentPeriod.startDate = new Date("3000-08-22");
    }
    if (!rentPeriod.endDate) {
        rentPeriod.endDate = new Date("1000-12-31");
    }
    if (!price.deposit) {
        price.deposit = 9999999;
    }
    if (!price.monthly) {
        price.monthly = 9999999;
    }
    let bed, table, chair, closet, airconditioner, induction, refrigerator, tv, microwave, washingmachine, cctv, wifi, parking, elevator;
    if (options.bed) {
        bed = [true];
    }
    else {
        bed = [true, false];
    }
    if (options.table) {
        table = [true];
    }
    else {
        table = [true, false];
    }
    if (options.chair) {
        chair = [true];
    }
    else {
        chair = [true, false];
    }
    if (options.closet) {
        closet = [true];
    }
    else {
        closet = [true, false];
    }
    if (options.airconditioner) {
        airconditioner = [true];
    }
    else {
        airconditioner = [true, false];
    }
    if (options.induction) {
        induction = [true];
    }
    else {
        induction = [true, false];
    }
    if (options.refrigerator) {
        refrigerator = [true];
    }
    else {
        refrigerator = [true, false];
    }
    if (options.tv) {
        tv = [true];
    }
    else {
        tv = [true, false];
    }
    if (options.microwave) {
        microwave = [true];
    }
    else {
        microwave = [true, false];
    }
    if (options.washingmachine) {
        washingmachine = [true];
    }
    else {
        washingmachine = [true, false];
    }
    if (options.cctv) {
        cctv = [true];
    }
    else {
        cctv = [true, false];
    }
    if (options.wifi) {
        wifi = [true];
    }
    else {
        wifi = [true, false];
    }
    if (options.parking) {
        parking = [true];
    }
    else {
        parking = [true, false];
    }
    if (options.elevator) {
        elevator = [true];
    }
    else {
        elevator = [true, false];
    }
    if (!conditions.gender || conditions.gender.length === 0) {
        conditions.gender = ["남성", "여성", "무관"];
    }
    if (!conditions.smoking || conditions.smoking.length === 0) {
        conditions.smoking = ["비흡연", "무관"];
    }
    const userCertification = yield models_1.Certification.findOne({
        where: { userID },
    });
    const universityName = userCertification.university;
    const university = yield models_1.University.findOne({
        where: { university: universityName },
        attributes: ["university", "lat", "lng"],
    });
    const rawRooms = yield models_1.Room.findAll({
        order: [["createdAt", "DESC"]],
        where: { isDeleted: false, university: universityName },
        include: [
            {
                model: models_1.User,
                where: { isDeleted: false },
                attributes: [],
                required: true,
            },
            {
                model: models_1.RoomType,
                attributes: ["roomType", "category", "rentType"],
                where: {
                    roomType: { [sequelize_1.Op.in]: type.roomType },
                    category: { [sequelize_1.Op.in]: type.category },
                    rentType: { [sequelize_1.Op.in]: type.rentType },
                },
            },
            {
                model: models_1.RoomPrice,
                attributes: ["monthly", "deposit"],
                where: {
                    deposit: { [sequelize_1.Op.lte]: price.deposit },
                    monthly: { [sequelize_1.Op.lte]: price.monthly },
                },
            },
            {
                model: models_1.RoomPeriod,
                attributes: ["startDate", "endDate"],
                where: {
                    startDate: { [sequelize_1.Op.lte]: rentPeriod.startDate },
                    endDate: { [sequelize_1.Op.gte]: rentPeriod.endDate },
                },
            },
            {
                model: models_1.RoomInformation,
                attributes: ["area", "floor", "query", "post", "address", "lat", "lng"],
            },
            { model: models_1.RoomPhoto, attributes: ["main"] },
            { model: models_1.Like, where: { userID, isLike: true }, required: false },
            {
                model: models_1.RoomOption,
                attributes: [],
                where: {
                    bed: { [sequelize_1.Op.in]: bed },
                    table: { [sequelize_1.Op.in]: table },
                    chair: { [sequelize_1.Op.in]: chair },
                    closet: { [sequelize_1.Op.in]: closet },
                    airconditioner: { [sequelize_1.Op.in]: airconditioner },
                    induction: { [sequelize_1.Op.in]: induction },
                    refrigerator: { [sequelize_1.Op.in]: refrigerator },
                    tv: { [sequelize_1.Op.in]: tv },
                    microwave: { [sequelize_1.Op.in]: microwave },
                    washingmachine: { [sequelize_1.Op.in]: washingmachine },
                    cctv: { [sequelize_1.Op.in]: cctv },
                    wifi: { [sequelize_1.Op.in]: wifi },
                    parking: { [sequelize_1.Op.in]: parking },
                    elevator: { [sequelize_1.Op.in]: elevator },
                },
            },
            {
                model: models_1.RoomCondition,
                attributes: [],
                where: {
                    gender: { [sequelize_1.Op.in]: conditions.gender },
                    smoking: { [sequelize_1.Op.in]: conditions.smoking },
                },
            },
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
    const newMessageNum = yield models_1.Participant.count({
        where: { userID, new: true },
    });
    const resData = { university, newMessageNum, rooms };
    return resData;
});
/**
 *  @방_좋아요
 *  @route POST api/v1/room/like
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 */
const POSTlikeService = (userID, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !roomID)
        return -1;
    const user = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 2. 권한이 없는 user
    if (!user.certificated)
        return -2;
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    const room = yield models_1.Room.findOne({ where: { roomID, isDeleted: false } });
    // 3. no room
    if (!room)
        return -3;
    let like = yield models_1.Like.findOne({ where: { userID, roomID } });
    if (!like) {
        yield models_1.Like.create({ roomID, userID, isLike: true });
        return 1;
    }
    else {
        if (!like.isLike) {
            yield models_1.Like.update({ isLike: true }, { where: { userID, roomID } });
            return 1;
        }
        else {
            yield models_1.Like.update({ isLike: false }, { where: { userID, roomID } });
            return 2;
        }
    }
    return undefined;
});
/**
 *  @방_삭제하기
 *  @route Delete /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 유저 id 잘못됨
 *      2. 유저 권한 없음
 *      3. 존재하지 않는 방
 *      4. 이미 삭제된 방
 */
const DELETEroomService = (userID, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findOne({ where: { userID } });
    // 1. 유저 id 잘못됨
    if (!user) {
        return -1;
    }
    // 2. 유저 권한 없음
    const certification = yield models_1.Certification.findOne({ where: { userID } });
    if (!certification) {
        return -2;
    }
    const alreadyRoom = yield models_1.Room.findOne({ where: { roomID } });
    if (alreadyRoom.uploader !== userID)
        return -3;
    if (alreadyRoom.isDeleted)
        return -4;
    yield models_1.Room.update({ isDeleted: true }, { where: { roomID } });
    return undefined;
});
const roomService = {
    POSTroomService,
    PATCHroomService,
    GETallRoomService,
    GETroomDetailService,
    POSTlikeService,
    POSTroomFilterService,
    DELETEroomService,
};
exports.default = roomService;
//# sourceMappingURL=roomService.js.map