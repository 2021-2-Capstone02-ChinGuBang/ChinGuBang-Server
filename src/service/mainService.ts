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
} from "../models";

// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { date, cast } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";
import { ConnectionTimedOutError, Op, QueryTypes, Sequelize } from "sequelize";

/**
 *  @메인페이지
 *  @route GET api/v1/main
 *  @access private
 *  @error
 */

const GETmainService = async (userID: number) => {
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const rawRooms = await Room.findAll({
    order: [["createdAt", "DESC"]],
    where: { isDeleted: false, university },
    include: [
      {
        model: User,
        where: { isDeleted: false },
        attributes: [],
        required: true,
      },
      { model: RoomType, attributes: ["roomType", "category", "rentType"] },
      { model: RoomPrice, attributes: ["monthly", "deposit"] },
      { model: RoomPeriod, attributes: ["startDate", "endDate"] },
      {
        model: RoomInformation,
        attributes: ["area", "floor", "query", "post", "address"],
      },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID, isLike: true }, required: false },
    ],
    attributes: ["roomID", "createdAt"],
  });

  const rooms = rawRooms.map((room) => {
    return {
      roomID: room.roomID,
      createdAt: date.dateToString(room.createdAt),
      type: room.type,
      price: room.price,
      rentPeriod: {
        startDate: date.dateToString(room.rentPeriod.startDate),
        endDate: date.dateToString(room.rentPeriod.endDate),
      },
      information: room.information,
      photo: room.photo,
      isLike: room.likes.length ? true : false,
    };
  });

  const totalRoomNum = await Room.count({
    where: { isDeleted: false, university },
  });
  const resData = { rooms, totalRoomNum };
  return resData;
};

const mainService = {
  GETmainService,
};

export default mainService;
