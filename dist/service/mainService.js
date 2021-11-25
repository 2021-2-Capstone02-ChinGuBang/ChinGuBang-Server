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
 *  @메인페이지
 *  @route GET api/v1/main
 *  @access private
 *  @error
 */
const GETmainService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
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
            { model: models_1.RoomType, attributes: ["roomType", "category", "rentType"] },
            { model: models_1.RoomPrice, attributes: ["monthly", "deposit"] },
            { model: models_1.RoomPeriod, attributes: ["startDate", "endDate"] },
            {
                model: models_1.RoomInformation,
                attributes: ["area", "floor", "query", "post", "address", "lat", "lng"],
            },
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
    const newMessageNum = yield models_1.Participant.count({
        where: { userID, new: true },
    });
    const totalRoomNum = yield models_1.Room.count({
        where: { isDeleted: false, university: universityName },
    });
    const resData = { university, newMessageNum, rooms, totalRoomNum };
    return resData;
});
const mainService = {
    GETmainService,
};
exports.default = mainService;
//# sourceMappingURL=mainService.js.map