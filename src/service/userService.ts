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
// DTO
import { userDTO } from "../DTO";
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
 *  @내방_보기
 *  @route GET api/v1/user/room
 *  @access private
 *  @error
 */

const GETmyRoomService = async (userID: number) => {
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const rawRooms = await Room.findAll({
    order: [["createdAt", "DESC"]],
    where: { isDeleted: false, university, uploader: userID },
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
      { model: RoomInformation, attributes: ["area", "floor"] },
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

/**
 *  @프로필_조회
 *  @route GET api/v1/user
 *  @access private
 *  @error
 */

const GETprofileService = async (userID: number) => {
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const user = await User.findOne({
    where: { userID, isDeleted: false },
    attributes: ["userID", "nickname", "email"],
  });
  if (!user) return -1;

  const rooms = await Room.findAll({
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
      { model: RoomInformation, attributes: ["area", "floor"] },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID, isLike: true }, required: true },
    ],
    attributes: ["roomID", "createdAt"],
  });

  const likeRooms = rooms.map((room) => {
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

  const resData = { user, likeRooms };
  return resData;
};

/**
 *  @프로필_수정
 *  @route PATCH api/v1/user
 *  @access private
 *  @error
 *      1. 요청 바디 부족
 *      2. 존재하지 않는 유저
 */

const PATCHuserService = async (userID: number, nickname: string) => {
  if (!nickname) return -1;
  const user = await User.findOne({
    where: { userID, isDeleted: false },
  });
  if (!user) return -2;

  await User.update({ nickname }, { where: { userID } });

  return undefined;
};

const userService = {
  GETmyRoomService,
  GETprofileService,
  PATCHuserService,
};

export default userService;
