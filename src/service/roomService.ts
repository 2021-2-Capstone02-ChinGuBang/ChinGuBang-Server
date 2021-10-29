// models
import {
  User,
  Certification,
  Room,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
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
 *  @방_내놓기
 *  @route Post /api/v1/room
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const POSTroomService = async (
  userID: number,
  reqData: roomDTO.postRoomReqDTO,
  url?
) => {
  const {
    type,
    address,
    information,
    rentPeriod,
    options,
    conditions,
    description,
  } = reqData;

  console.log(reqData);
  // 1. 요청 바디 부족
  if (
    !type ||
    !address ||
    !information ||
    !rentPeriod ||
    !options ||
    !conditions ||
    !description
  ) {
    console.log("here!");
    return -1;
  }

  const user = await User.findOne({ where: { userID } });

  // 2. 유저 id 잘못됨
  if (!user) {
    return -2;
  }

  // 3. 유저 권한 없음
  const certification = await Certification.findOne({ where: { userID } });

  if (!certification) {
    return -3;
  }

  // room 생성
  const newRoom = await Room.create({
    uploader: userID,
  });

  await RoomInformation.create({
    roomID: newRoom.roomID,
    roomType: type.roomType,
    category: type.category,
    rentType: type.rentType,
    deposit: cast.stringToNumber(information.deposit),
    monthly: cast.stringToNumber(information.monthly),
    control: cast.stringToNumber(information.control),
    area: cast.stringToNumber(information.area),
    floor: cast.stringToNumber(information.floor),
    construction: cast.stringToNumber(information.construction),
    startDate: date.stringToDate(rentPeriod.startDate),
    endDate: date.stringToDate(rentPeriod.endDate),
    address,
    description,
    university: certification.university,
  });

  await RoomCondition.create({
    roomID: newRoom.roomID,
    gender: conditions.gender,
    smoking: cast.stringToBoolean(conditions.smoking),
  });

  await RoomPhoto.create({
    roomID: newRoom.roomID,
    main: url.main,
    restroom: url.restroom,
    kitchen: url.kitchen,
    photo1: url.photo1,
    photo2: url.photo2,
    photo3: url.photo3,
  });

  await RoomOption.create({
    roomID: newRoom.roomID,
    bed: cast.stringToBoolean(options.bed),
    table: cast.stringToBoolean(options.table),
    chair: cast.stringToBoolean(options.chair),
    closet: cast.stringToBoolean(options.closet),
    airconditioner: cast.stringToBoolean(options.airconditioner),
    induction: cast.stringToBoolean(options.induction),
    refrigerator: cast.stringToBoolean(options.refrigerator),
    tv: cast.stringToBoolean(options.tv),
    doorlock: cast.stringToBoolean(options.doorlock),
    microwave: cast.stringToBoolean(options.microwave),
    washingmachine: cast.stringToBoolean(options.washingmachine),
    cctv: cast.stringToBoolean(options.cctv),
    wifi: cast.stringToBoolean(options.wifi),
    parking: cast.stringToBoolean(options.parking),
    elevator: cast.stringToBoolean(options.elevator),
  });

  // table join
  const room = await Room.findOne({
    where: {
      roomID: newRoom.roomID,
    },
    include: [
      {
        model: User,
        attributes: ["userID", "nickname"],
      },
      RoomInformation,
      RoomCondition,
      RoomPhoto,
      RoomOption,
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
};

const roomService = {
  POSTroomService,
};

export default roomService;
