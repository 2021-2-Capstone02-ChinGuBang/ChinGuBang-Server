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
 *  @방_내놓기
 *  @route Post /api/v1/room
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const POSTroomService = async (userID: number, reqData) => {
  const { type, price, information, rentPeriod, options, conditions, photo } =
    reqData;

  // 1. 요청 바디 부족
  if (
    !type ||
    !information ||
    !rentPeriod ||
    !options ||
    !conditions ||
    !photo
  ) {
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
    university: certification.university,
  });

  await RoomType.create({
    roomID: newRoom.roomID,
    roomType: type.roomType,
    category: type.category,
    rentType: type.rentType,
  });

  await RoomInformation.create({
    roomID: newRoom.roomID,
    area: cast.stringToNumber(information.area),
    floor: cast.stringToNumber(information.floor),
    construction: cast.stringToNumber(information.construction),
    address: information.address,
    description: information.description,
  });

  await RoomPrice.create({
    roomID: newRoom.roomID,
    deposit: cast.stringToNumber(price.deposit),
    monthly: cast.stringToNumber(price.monthly),
    control: cast.stringToNumber(price.control),
  });

  await RoomPeriod.create({
    roomID: newRoom.roomID,
    startDate: date.stringToDate(rentPeriod.startDate),
    endDate: date.stringToDate(rentPeriod.endDate),
  });

  await RoomCondition.create({
    roomID: newRoom.roomID,
    gender: conditions.gender,
    smoking: cast.stringToBoolean(conditions.smoking),
  });

  await RoomPhoto.create({
    roomID: newRoom.roomID,
    main: photo.main,
    restroom: photo.restroom,
    kitchen: photo.kitchen,
    photo1: photo.photo1,
    photo2: photo.photo2,
    photo3: photo.photo3,
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
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
      },
      {
        model: RoomPrice,
        attributes: ["deposit", "monthly", "control"],
      },
      {
        model: RoomInformation,
        attributes: ["area", "floor", "construction", "address", "description"],
      },
      {
        model: RoomOption,
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
        model: RoomCondition,
        attributes: ["gender", "smoking"],
      },
      {
        model: RoomPhoto,
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

  return resData;
};

/**
 *  @모든_방_보기
 *  @route GET api/v1/room?offset=@&limit=
 *  @access private
 *  @error
 *    1. no limit
 */

const GETallRoomService = async (
  userID: number,
  offset?: number,
  limit?: number
) => {
  if (!offset) {
    offset = 0;
  }

  // 1. No limit
  if (!limit) {
    return -1;
  }
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

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
      { model: RoomType, attributes: ["roomType", "category"] },
      { model: RoomPrice, attributes: ["monthly", "deposit"] },
      { model: RoomPeriod, attributes: ["startDate", "endDate"] },
      { model: RoomInformation, attributes: ["area", "floor"] },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID }, required: false },
    ],
    attributes: ["roomID", "createdAt"],
    offset,
    limit,
  });

  const totalRoomNum = await Room.count({
    where: { isDeleted: false, university },
  });
  const resData = { rooms, totalRoomNum };
  return resData;
};

/**
 *  @방_보기_deail
 *  @route GET api/v1/room/:roomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. no user
 *    3. no room
 */

const GETroomDetailService = async (userID: number, roomID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !roomID) return -1;

  const user = await User.findOne({ where: { userID, isDeleted: false } });

  // 2. no user
  if (!user) return -2;
  const userCertification = await Certification.findOne({ where: { userID } });

  const university = await userCertification.university;

  // table join
  const room = await Room.findOne({
    where: {
      roomID,
      isDeleted: false,
    },
    include: [
      {
        model: User,
        attributes: ["userID", "nickname"],
      },
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
      },
      {
        model: RoomPrice,
        attributes: ["deposit", "monthly", "control"],
      },
      {
        model: RoomInformation,
        attributes: ["area", "floor", "construction", "address", "description"],
      },
      {
        model: RoomOption,
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
        model: RoomCondition,
        attributes: ["gender", "smoking"],
      },
      {
        model: RoomPhoto,
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
  // 3. no room
  if (!room) return -3;

  const resData = room;
  return resData;
};
const roomService = {
  POSTroomService,
  GETallRoomService,
  GETroomDetailService,
};

export default roomService;
