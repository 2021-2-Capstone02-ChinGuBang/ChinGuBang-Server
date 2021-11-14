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
import { roomDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { date, cast } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @
 *  @route POST api/v1/message
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 */

const POSTlikeService = async (userID: number, roomID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !roomID) return -1;

  const user = await User.findOne({ where: { userID, isDeleted: false } });

  // 2. 권한이 없는 user
  if (!user.certificated) return -2;

  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const room = await Room.findOne({ where: { roomID, isDeleted: false } });
  // 3. no room
  if (!room) return -3;

  let like = await Like.findOne({ where: { userID, roomID } });

  if (!like) {
    await Like.create({ roomID, userID, isLike: true });
    return 1;
  } else {
    if (!like.isLike) {
      await Like.update({ isLike: true }, { where: { userID, roomID } });
      return 1;
    } else {
      await Like.update({ isLike: false }, { where: { userID, roomID } });
      return 2;
    }
  }
};

const messageService = {};

export default messageService;
